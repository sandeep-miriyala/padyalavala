//! The app's core in Rust. `yuktai build` compiles it to WebAssembly (public/wasm/core.wasm)
//! and src/lib/core.ts calls it from the browser, with a TypeScript fallback.
//!
//! Strings cross from JavaScript as bytes: JS asks for memory with `alloc`, writes UTF-8
//! into it, calls a function with (pointer, length), then gives the memory back with `dealloc`.

/// Characters that separate words (besides spaces): ASCII punctuation and a few common
/// Unicode marks, including the Devanagari danda. Kept the same as the TypeScript fallback.
fn is_separator(c: char) -> bool {
    c.is_whitespace()
        || c.is_ascii_punctuation()
        || matches!(c, '“' | '”' | '‘' | '’' | '—' | '–' | '…' | '।' | '॥')
}

/// Words in a text, in any script (English, Telugu, Hindi, …).
pub fn count_words(text: &str) -> u32 {
    text.split(is_separator)
        .filter(|w| w.chars().any(char::is_alphanumeric))
        .count() as u32
}

// ── WebAssembly interface ───────────────────────────────────────────────────

/// Memory for JavaScript to write into.
#[no_mangle]
pub extern "C" fn alloc(len: usize) -> *mut u8 {
    let mut buf = Vec::<u8>::with_capacity(len);
    let ptr = buf.as_mut_ptr();
    core::mem::forget(buf);
    ptr
}

/// Gives back memory from `alloc`.
///
/// # Safety
/// `ptr` and `len` must come from one `alloc` call.
#[no_mangle]
pub unsafe extern "C" fn dealloc(ptr: *mut u8, len: usize) {
    drop(Vec::from_raw_parts(ptr, 0, len));
}

/// `count_words` for JavaScript: the text is UTF-8 at (ptr, len).
///
/// # Safety
/// (ptr, len) must point at `len` bytes written by JavaScript.
#[no_mangle]
pub unsafe extern "C" fn count_words_utf8(ptr: *const u8, len: usize) -> u32 {
    let bytes = core::slice::from_raw_parts(ptr, len);
    match core::str::from_utf8(bytes) {
        Ok(text) => count_words(text),
        Err(_) => 0,
    }
}


// ── Letter tracing (అక్షరమాల: "రాసి చూడండి") ───────────────────────────────
// The page draws the letter and the child's strokes on two small square grids (one byte per
// cell, 0 = empty). A stroke counts when it is within TOLERANCE cells of the letter.

/// How far (in cells) a stroke may be from the letter and still count.
pub const TOLERANCE: isize = 2;
/// A cell with at least this much ink counts as ink.
pub const INK_THRESHOLD: u8 = 32;

fn dilate(mask: &[bool], side: usize, radius: isize) -> Vec<bool> {
    let mut out = vec![false; mask.len()];
    for y in 0..side {
        for x in 0..side {
            if !mask[y * side + x] {
                continue;
            }
            for dy in -radius..=radius {
                for dx in -radius..=radius {
                    let (nx, ny) = (x as isize + dx, y as isize + dy);
                    if nx >= 0 && ny >= 0 && (nx as usize) < side && (ny as usize) < side {
                        out[ny as usize * side + nx as usize] = true;
                    }
                }
            }
        }
    }
    out
}

/// (coverage %, precision %): how much of the letter was traced, and how much of the
/// drawing is on the letter. None when the sizes are wrong or the letter is empty.
pub fn trace_score(drawn: &[u8], target: &[u8], side: usize) -> Option<(u8, u8)> {
    if side == 0 || drawn.len() != side * side || target.len() != side * side {
        return None;
    }
    let drawn: Vec<bool> = drawn.iter().map(|&v| v >= INK_THRESHOLD).collect();
    let target: Vec<bool> = target.iter().map(|&v| v >= INK_THRESHOLD).collect();
    let target_total = target.iter().filter(|&&t| t).count();
    if target_total == 0 {
        return None;
    }
    let drawn_total = drawn.iter().filter(|&&d| d).count();
    if drawn_total == 0 {
        return Some((0, 0));
    }
    let drawn_near = dilate(&drawn, side, TOLERANCE);
    let target_near = dilate(&target, side, TOLERANCE);
    let covered = target.iter().zip(&drawn_near).filter(|(t, d)| **t && **d).count();
    let precise = drawn.iter().zip(&target_near).filter(|(d, t)| **d && **t).count();
    Some(((covered * 100 / target_total) as u8, (precise * 100 / drawn_total) as u8))
}

/// `trace_score` for JavaScript: both grids are `side * side` bytes in memory from `alloc`.
/// Returns coverage << 8 | precision, or u32::MAX when the letter can't be scored.
///
/// # Safety
/// Both pointers must point at `side * side` bytes written by JavaScript.
#[no_mangle]
pub unsafe extern "C" fn score_trace(drawn: *const u8, target: *const u8, side: usize) -> u32 {
    let cells = side * side;
    let d = core::slice::from_raw_parts(drawn, cells);
    let t = core::slice::from_raw_parts(target, cells);
    match trace_score(d, t, side) {
        Some((coverage, precision)) => (u32::from(coverage) << 8) | u32::from(precision),
        None => u32::MAX,
    }
}

#[cfg(test)]
mod tests {
    use super::{count_words, trace_score};

    #[test]
    fn trace_exact_and_empty() {
        let side = 8;
        let mut letter = vec![0u8; side * side];
        for x in 2..6 { letter[3 * side + x] = 255; }
        assert_eq!(trace_score(&letter, &letter, side), Some((100, 100)));
        assert_eq!(trace_score(&vec![0; side * side], &letter, side), Some((0, 0)));
        assert_eq!(trace_score(&letter, &vec![0; side * side], side), None);
        assert_eq!(trace_score(&letter, &letter[..10], side), None);
    }

    #[test]
    fn trace_far_away_strokes_are_not_precise() {
        let side = 16;
        let mut letter = vec![0u8; side * side];
        let mut drawn = vec![0u8; side * side];
        for x in 0..4 { letter[x] = 255; drawn[15 * side + 12 + x] = 255; }
        assert_eq!(trace_score(&drawn, &letter, side), Some((0, 0)));
    }

    #[test]
    fn english() {
        assert_eq!(count_words("Hello, world! This is YuktAI."), 5);
    }

    #[test]
    fn telugu_and_hindi() {
        assert_eq!(count_words("నమస్కారం ప్రపంచం"), 2);
        assert_eq!(count_words("नमस्ते दुनिया। स्वागत है॥"), 4);
    }

    #[test]
    fn numbers_count_punctuation_does_not() {
        assert_eq!(count_words("Version 5.3.12 — out now…"), 6);
        assert_eq!(count_words(" — … । "), 0);
        assert_eq!(count_words(""), 0);
    }
}
