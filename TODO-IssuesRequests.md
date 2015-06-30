# Troubleshoot / Known issues

1. If a request is unsuccessful, `true` value in the `A1` cell in the `Google Sheet` must be set manually to `false`

# TODO

1. Auto-Delete the oldest videos in the playlist when 200 limit is reached
2. Make set up process quick and easy (release as an app?) (Google fixing [this Script bug](https://code.google.com/p/google-apps-script-issues/issues/detail?id=5188) would help immensely)
3. In case of unsuccessful requests, add some kind of exception handling (so that there's no need to manually reset the flag every time)
4. Carefully test whether no video is skipped in case of the request failures
