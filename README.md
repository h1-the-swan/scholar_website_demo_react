# Nautilus Visualization Showing Scholarly Influence -- Demo

Jason Portenoy

Source code for <scholar.eigenfactor.org>

2020-09-18 The visualization works, but it is not updated for React, etc.

Run `yarn build` to build the static website. Then the static site can be served from `./build`.

## Uploading to S3 bucket

```
# set environment variables: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
source set_environment_variables.sh

# upload to S3
aws s3 sync ./build s3://scholar.eigenfactor.org --acl public-read
```

Make sure S3 bucket is configured to serve both "Index document" and "Error document" as `index.html`, otherwise routing won't work properly.

<hr />

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
