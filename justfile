default:
	just --list

alias r := render
alias b := bundle-dev
alias t := test

# render markdown
render:
	deno run --no-check tpl.ts | deno run --allow-read --allow-write --no-check ./scripts/render.ts --log-level debug

# bundle schemas (dev)
bundle-dev:
	BUNDLE_RELEASE=0 deno run --no-check --unstable --allow-all ./scripts/bundle.ts

# bundle schemas (release)
bundle-release:
	BUNDLE_RELEASE=1 deno run --no-check --unstable --allow-all ./scripts/bundle.ts

test:
	deno test --allow-read=./test/example_data

cache:
	deno cache --no-check {src,test,scripts}/deps/*.ts src/examples/*.ts

# run udd (https://deno.land/x/udd)
update:
	deno run --allow-all --no-check https://deno.land/x/udd@0.5.0/main.ts {src,test,scripts}/deps/*.ts src/examples/*.ts
