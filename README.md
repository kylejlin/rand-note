# Random Note Generator

[https://kylejlin.github.io/rand-note](https://kylejlin.github.io/rand-note)

A minimal app that generates random (musical) notes within the range of one octave.

I initially created it to help with [this guitar exercise](https://www.youtube.com/watch?v=PJddQ6Q0UDo).

This is a [PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps), so you should be able to add it to your homescreen and use it offline (if your device supports it).

## Usage

Click anywhere to generate a note.
Click again to generate another note.
Click again to generatee yet another note.
...You get the idea.

### Settings

- By default, the app will not generate repeat notes. You can change this in the settings.
- By default, the app will only generate natural notes (no sharps or flats). Again, you can change this in the settings.
- By default, the app will "treat sharps and flats as distinct", meaning it will consider A sharp to be a different note than B flat. You can change this in settings.

## Development

```sh
git clone https://github.com/kylejlin/rand-note.git
cd rand-note
npm run smart-install
```

### What's `smart-install`?

In an effort to avoid builds that mysteriously break in the future, `node_modules` are compressed and committed as a tarball.
`smart-install` will try to restore `node_modules` from said tarball.
If that fails, it will fall back to `npm install`.

If you're contributing, it is preferred that you use `smart-install`.
If you're not contributing (e.g., you're cloning for personal use), then you can use `npm install` if you prefer, though it may be
less reliable.