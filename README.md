# Old version! An updated one is [here](https://github.com/Elijas/auto-youtube-subscription-playlist-2).
Setup and usage is simplified (now it is one script, doesn't use gmail anymore).

---

# Description
This is a Google Apps Script that automatically adds new Youtube videos to a playlist (a replacement for Youtube Collections feature). This is done through scraping the Youtube subscription notifications in a gmail label. (a workaround for the current lack of support for the main feature in both Youtube UI and API).

# Features
1. Adds all new subscription videos to a Youtube playlist.
2. Optional ability to set automatic interval for execution
3. Optional ability to add only videos selected by a custom filter (e.g. videos from a particular users (e.g. videos of music), videos not yet customly filtered to other labels, etc.)

# Set-up Instructions
### Step 1

1. Opt to receive youtube subscription notifications ("Send updates") to email
2. Create a label in gmail (used exclusively for the youtube notifications, any name is fine, e.g. `youtube`)
3. Create a filter in gmail that adds a label (and perhaps preferably also skips inbox) to the youtube notifications (e.g. all emails `noreply@youtube.com` with a word `uploaded` in the title)

### Step 2
1. Copy both files to your drive: [Document](https://goo.gl/9CN1Qo) and [Sheet](https://goo.gl/ly9JvJ)
2. Open the Script Editors (in menu: `Tools` / `Script Editor...`) of both Sheet and Document and change the following variables: 
  - `var sheetId` (string in the URL of the Sheet between `/d/` and `/edit`)
  - `var docId` (string in the URL of the Document between `/d/` and `/edit`)
  - `var label` (text after `label:` in gmail search bar when the label is selected)
  - `var playlistId` (string in the URL of the Youtube Playlist after `?list=`)
3. Open the Script Editor of the sheet, then in menu: `Resources` / `Advanced Google Services` / `Google Developers Console` / `Youtube API` / `Enable API`
4. Open the Document and run `Functions` / `getGmail` once and open the Document and run `Functions` / `putYoutube` once to authorize access for the app.

### Step 2 (Alternative)

1. Create a Google Document (in Google Drive) and open it
2. In menu: `Tools` / `Script Editor` copy-paste the code from `docScript.gs` in the repo
3. Create a Google Sheet (in Google Drive) and open it
4. Add `false` to `A1` of the Sheet
5. Open `Tools` / `Script Editor`
6. Copy-paste the code from `sheetScript.gs` in the repo
7. Open the Script Editors (in menu: `Tools` / `Script Editor`) of both Sheet and Document and change the following variables: 
  - `var sheetId` (string in the URL of the Sheet between `/d/` and `/edit`)
  - `var docId` (string in the URL of the Document between `/d/` and `/edit`)
  - `var label` (text after `label:` in gmail search bar when the label is selected)
  - `var playlistId` (string in the URL of the Youtube Playlist after `?list=`)
8. `Resources` / `Advanced Google Services` -> Youtube Data API must be ON
9. `Google Developers Console` / `Youtube API` / `Enable API`
10. Open the Document and run `Functions` / `getGmail` once and open the Socument and run `Functions` / `putYoutube` once to authorize access for the app.

# Usage

##### Manual playlist update:

1. Open the Google Document, then in menu: `Functions` / `getGmail`
2. Open the Google Sheet, then in menu: `Functions` / `putYoutube`

##### Scheduled playlist update:

For both Google Document and Google Sheet in their `Script Editor`s:

1. In menu: `Resources` / `Current project triggers`
2. `getGmail` (or `putYoutube`) -> `Time driven` -> `Hour timer` -> `Every hour`
3. `Save`

##### (Extra) Link to remove all items:

To remove all playlist items, bookmark the link below and click on it while having the youtube playlist page open.

`javascript:(function() { if (confirm('Remove all?')) {var i = window.setInterval(function() {var closeButton = document.querySelector('.pl-video-edit-remove');    if (closeButton) {      closeButton.click();    } else {      window.clearInterval(i);    }}, 500);}})();` ([source](https://gist.github.com/timothyarmstrong/10501804))

# Feedback

[Official Reddit Thread](https://www.reddit.com/r/youtube/comments/3br98c/a_way_to_automatically_add_subscriptions_to/)
