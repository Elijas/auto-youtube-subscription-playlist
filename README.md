# Overview
This is an early release of a Google Script that automatically compiles a playlist out of youtube subscription notifications received inside a gmail label (useful to split subscriptions into groups using gmail filters).

# Features
1. Updates playlist every hour *(optional)*
2. Ability to add different subscriptions (e.g. videos of music, videos from a particular users) to different playlists *(optional)*

# Instructions
### Step 1

1. Select to receive youtube subscription notifications
2. Create a label in gmail (any name is fine, `youtube` by default)
3. Create a filter inside gmail that adds the label to the youtube notifications (from `noreply@youtube.com` by default)

### Step 2
1. Copy both files to your drive: [Document](https://docs.google.com/document/d/12O-p7f6b1lyRlsSKMVEo69wztinsrPBG_s3TRt9rs2Q/copy) and [Sheet](https://docs.google.com/spreadsheets/d/15kvJ-7ERa3iEc5XbYyZ2F6EeOO_i5kduxhHCIBrYSB8/copy)

OR

1. Create a Google Document and a Google Sheet
2. Add `false` to `A1` of Google Sheet
3. In menu: `Tools` / `Script Editor` copy paste the code from the repo

### Step 3

1. In menu: `Tools` / `Script Editor` change variables `var sheetId`, `var docId`, `var label`, `var playlistId` 

# Usage

##### Manual:

1. Open the Google Document, then in menu: `Functions` / `getGmail`
2. Open the Google Sheet, then in menu: `Functions` / `putYoutube`

##### Automatic:

For both, Google Document and Google Sheet, in the `Script Editor` 

1. In menu: `Resources` / `Current project triggers`
2. `getGmail` or `putYoutube` -> `Time driven` -> `Hour timer` -> `Every hour`
3. `Save`
