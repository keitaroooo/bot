import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { App } from "octokit";
dotenv.config();

const app = new App({
  appId: process.env.APP_ID,
  privateKey: process.env.GITHUB_APP_PRIVATE_KEY,
});

for await (const { installation } of app.eachInstallation.iterator()) {
  for await (const { octokit, repository } of app.eachRepository.iterator({
    installationId: installation.id,
  })) {
    octokit.rest.pulls
      .list({
        owner: repository.owner.login,
        repo: repository.name,
      })
      .then((responce) => {
        if (responce.data.length > 0) {
          console.log(
            responce.data
              .map(
                (data) =>
                  data.user.login + " " + data.title + " " + repository.name
              )
              .join("\n")
          );
        }
      })
      .catch((exception) => {
        console.error(exception);
      });
  }
}
