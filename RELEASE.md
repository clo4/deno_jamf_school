# How to create a release

Follow this document, top to bottom, and you should have a perfect release.

## 1. Create a release branch

```console
$ git checkout -b release/x.y.z
```

## 2. Bump the version

Edit [src/version.ts](src/version.ts)

## 3. Render the documentation

Make sure [src/README.tpl.md](src/README.tpl.md) is updated.

The documentation will need to be rendered again:

```bash
deno run -A --unstable --no-check ./scripts/render.ts
```

## 4. Run tests

Don't continue if the tests fail.

```bash
deno test --allow-read
```

## 5. Bundle for release

In Bash:

```bash
BUNDLE_RELEASE=1 deno -A --unstable --no-check ./scripts/bundle.ts
```

In PowerShell, it's definitely not a one-liner:

```powershell
$env:BUNDLE_RELEASE = 1
deno -A --unstable --no-check .\scripts\bundle.ts
Remove-Item Env:\BUNDLE_RELEASE
```

Now, run the tests again. Can't have any surprises.

```bash
deno test --allow-read
```

Don't continue if the tests fail.

## 6. Create a pull request

Use the version as the title, eg. '0.2.0', '0.3.0'

## 7. Leave it for a day. Seriously.

If you've forgotten anything, you'll remember in that time. There's no time crunch.

## 8. Squash and merge

You've done this before.

## 9. Create an annotated tag for the release

On the main branch, after fetching/merging the changes.

Use **just the version number**, do not include a leading 'v'.

```bash
git tag -a {version}
git push origin {version}
```
