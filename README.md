Podcast tracking site

This is made primarily for the Minnmax show but would be relatively easily to set up for any podcast or any episode-based content really.

Started out as a simple page that parses episode data to calculate apearance rates of individuals and display it in a chart. 
When the google sheet file I was pulling data from was abandoned I added a small express/react app inside the project to make adding new data possible.
It's setup so that all data is tracked in a plain .json file, which can then be directly loaded by the main page, which allows hosting on github pages for free.

The management app is pointed at a youtube playlist to make data entry easier by fetching title, description, and publish date
