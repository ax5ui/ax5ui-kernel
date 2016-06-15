**CDN urls**
```
https://cdn.rawgit.com/ax5ui/ax5ui-kernel/master/dist/ax5ui.all.css
https://cdn.rawgit.com/ax5ui/ax5ui-kernel/master/dist/ax5ui.all.js
https://cdn.rawgit.com/ax5ui/ax5ui-kernel/master/dist/ax5ui.all.min.js
```

# How to Play
1. Fork this Origninal repository to your repository.
2. Clone your repository to your desktop.
3. Open Terminal
4. Move to git folder (Folder Name : ax5ui-kernel)
5. Type this instruction : npm install

```
npm install
```
> Installing npm(Node Package Modules) to manage the node.js modules. please refer to an Internet


1. Type this instruction : gulp default
    * cf1> or Type this instruction : gulp
    * cf2> current Location : ax5ui-kernel

 
```js
toms-mac:ax5ui-kernel tom$ gulp default
[13:25:56] Using gulpfile ~/Works-OSS/ax5ui/ax5ui-kernel/gulpfile.js
[13:25:56] Starting 'default'...
[13:25:57] Finished 'default' after 227 msa
```
>* if you success, you can see this screen.
    2. if you fail to run gulp, the reason is "you don't have permission' or 'npm is not installed'"
    3. please refer to an Internet
    4. this keyword will help you : 
      1. npm init
      2. npm install -g gulp
      3. npm install --global gulp-cli
      4. sudo npm install --global gulp-cli



## Structure
```
ax5ui-kernel/
    build/
        push.sh     rebase with 'gh-pages' branch from 'master' branch, then change to 'master' branch.
        split.sh    ax5docs, ax5core, ax5ui-dialog, the contents of a folder, such as ax5ui-mask, it overrides in each of git.
    src/
        ax5core/    utility project for ax5ui      
        ax5ui-dialog/    ax5ui ax5dialog project
        ... ax5ui plugin projects
        ..
        .
    gulpfile.js
    package.json
```



