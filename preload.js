const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }

});

window.nodeRequire = require;
delete window.require;
delete window.exports;
delete window.module;

contextBridge.exposeInMainWorld('fileAPI', {

    checkFileExists: (folder, fileName) => {

        return fs.existsSync(path.join(folder, fileName))

    },

    writeFile: (folder, fileName, data) => {

        fs.writeFileSync(path.join(folder, fileName), data);

    },

    getCreatedDate: (folder, fileName) => {

        const { birthtime } = fs.statSync(path.join(folder, fileName));

        return birthtime;

    },

    getUserData: () => ipcRenderer.invoke('getUserData')


})

contextBridge.exposeInMainWorld('statusPageAPI', {

    getSubscribers: () => ipcRenderer.invoke('getSubscribers'),

    getComponents: () => ipcRenderer.invoke('getComponents'),

    getAPIKey: () => {

        return statusPageAPIKey;

    },

    getPageID: () => {

        return statusPageID;
    }

})

contextBridge.exposeInMainWorld('electron', {

    dialog: (method, config) => ipcRenderer.invoke('dialog', method, config).then(result => {

        return result;

    })

})

ipcRenderer.on("subscriberData", (event, subscriberData) => {

    ipcRenderer.invoke('getUserData').then(result => {

        const filePath = path.join(result, 'subscribers.json');

        console.log(filePath);

        fs.writeFileSync(filePath, JSON.stringify(subscriberData), err => {

            if (err) {

                console.log(err);

            } else {

                console.log("File written successfully");

            }

        });

    })

});

ipcRenderer.on("componentData", (event, componentData) => {

    ipcRenderer.invoke('getUserData').then(result => {

        const filePath = path.join(result, 'components.json');

        console.log(filePath);

        fs.writeFileSync(filePath, JSON.stringify(componentData), err => {

            if (err) {

                console.log(err);

            } else {

                console.log("File written successfully");

            }

        });

    })


})

// preload jQuery
ipcRenderer.on("jQuery", (event, jquery) => {

    window.JQuery = jquery;

})

ipcRenderer.on('dialog-response', (event, response) => {

    console.log(response);

})



