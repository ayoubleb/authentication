import FacebookAuthentication from '@authentication/facebook';
import GitHubAuthentication from '@authentication/github';
import GoogleAuthentication from '@authentication/google';
import TwitterAuthentication from '@authentication/twitter';
import express = require('express');
const app: express.Express = express();

const facebookAuthentication = new FacebookAuthentication({
  callbackURL: '/__/auth/facebook',
});
const gitHubAuthentication = new GitHubAuthentication({
  callbackURL: '/__/auth/github',
});
const googleAuthentication = new GoogleAuthentication({
  callbackURL: '/__/auth/google',
});
const twitterAuthentication = new TwitterAuthentication({
  callbackURL: '/__/auth/twitter',
});

app.use((req, res, next) => {
  console.log(req.method + ' ' + req.url);
  console.dir(req.headers);
  next();
});

app.get(facebookAuthentication.callbackPath, async (req, res, next) => {
  try {
    if (!facebookAuthentication.isCallbackRequest(req)) {
      facebookAuthentication.redirectToProvider(req, res, next, {
        scope: ['email'],
        state: 'Hello world',
      });
      return;
    }
    if (facebookAuthentication.userCancelledLogin(req)) {
      return res.redirect('/');
    }
    const {
      accessToken,
      refreshToken,
      profile,
      rawProfile,
      state,
    } = await facebookAuthentication.completeAuthentication(req, res, {
      imageSize: 256,
    });
    console.log({accessToken, refreshToken, state});
    res.json({profile, rawProfile});
  } catch (ex) {
    next(ex);
  }
});
app.get(gitHubAuthentication.callbackPath, async (req, res, next) => {
  try {
    if (!gitHubAuthentication.isCallbackRequest(req)) {
      gitHubAuthentication.redirectToProvider(req, res, next, {
        state: 'Hello world',
      });
      return;
    }
    if (gitHubAuthentication.userCancelledLogin(req)) {
      return res.redirect('/');
    }
    const {
      accessToken,
      refreshToken,
      profile,
      rawProfile,
      rawEmails,
      state,
    } = await gitHubAuthentication.completeAuthentication(req, res);
    console.log({accessToken, refreshToken, state, rawProfile, rawEmails});
    res.json(profile);
  } catch (ex) {
    next(ex);
  }
});
app.get(googleAuthentication.callbackPath, async (req, res, next) => {
  try {
    if (!googleAuthentication.isCallbackRequest(req)) {
      googleAuthentication.redirectToProvider(req, res, next, {
        state: 'Hello world',
      });
      return;
    }
    if (googleAuthentication.userCancelledLogin(req)) {
      return res.redirect('/');
    }
    const {
      accessToken,
      refreshToken,
      profile,
      state,
    } = await googleAuthentication.completeAuthentication(req, res);
    console.log({accessToken, refreshToken, state});
    res.json(profile);
  } catch (ex) {
    next(ex);
  }
});
app.get('/__/auth/twitter', async (req, res, next) => {
  try {
    if (!twitterAuthentication.isCallbackRequest(req)) {
      twitterAuthentication.redirectToProvider(req, res, next, {
        state: 'Hello world',
      });
      return;
    }
    if (twitterAuthentication.userCancelledLogin(req)) {
      return res.redirect('/');
    }
    const {
      token,
      tokenSecret,
      profile,
      rawProfile,
      state,
    } = await twitterAuthentication.completeAuthentication(req, res);
    console.log({token, tokenSecret, state});
    res.json({profile, rawProfile});
  } catch (ex) {
    next(ex);
  }
});

export default app;
