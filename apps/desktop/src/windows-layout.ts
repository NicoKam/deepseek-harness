/** Shared geometry for the Windows main-window caption. */

/** Windows application titlebar height in device-independent pixels. */
export const WINDOWS_TITLEBAR_HEIGHT = 40

/** Platforms whose main window draws its caption inside Chromium's window-controls overlay. */
export const OVERLAY_CAPTION = process.platform === 'win32' || process.platform === 'linux'
