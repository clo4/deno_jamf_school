# internal

This directory is not part of the public API. There is no guarantee of stability as all files are considered implementation details.

## Structure

Files are named after the primary thing they export.

## Notes

- Some method signatures slightly deviate from their model (eg. `Location.moveUsers`) to ensure that the optional optimizations are truly optional.

- "Set" methods assume that everything is up-to-date. For example, if you call `device.setLocation(loc)` and the device's `locationId` is the same as `loc.locationId`, the request will be skipped since there would be no change. If you _expect_ data to change (eg. in long-running scripts that reuse objects), call `update()` before passing it to another method.
