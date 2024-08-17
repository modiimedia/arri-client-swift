import Degit from "degit";
import fs from "fs-extra";
import path from "node:path";

const tempDir = path.resolve(".temp");

async function main() {
    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true });
    }
    fs.mkdirSync(tempDir);
    const degit = Degit("modiimedia/arri/languages/swift/swift-client", {
        force: true,
    });
    await degit.clone(tempDir);
    fs.copySync(tempDir, ".", { overwrite: true });
    if (fs.existsSync(".gitignore")) {
        let gitIgnore = fs.readFileSync(".gitignore", "utf8");
        if (!gitIgnore.includes("node_modules")) {
            gitIgnore += "\nnode_modules\n**/node_modules";
        }
        if (!gitIgnore.includes(".temp")) {
            gitIgnore += "\n.temp";
        }
        fs.writeFileSync(".gitignore", gitIgnore, "utf8");
    }
    if (fs.existsSync("project.json")) {
        fs.rmSync("project.json");
    }
    if (fs.existsSync("README.md")) {
        let readme = fs.readFileSync("README.md", "utf8");
        readme = `_**Attention**:_

_This repo is a mirror of a subdirectory in the Arri RPC monorepo. It only exists to facilitate distribution for the Swift Package Manager. To submit an issue or make a PR please go to the [official Arri repo](https://github.com/modiimedia/arri)._

${readme}`;
        fs.writeFileSync("README.md", readme, "utf8");
    }
    process.exit(0);
}

main();
