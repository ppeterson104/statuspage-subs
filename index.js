const path = require("path");
const axios = require("axios");
require('dotenv').config({ path: path.join(__dirname, '.env') });
const fs = require('fs');
const electron = require("electron");
const { app, BrowserWindow, dialog, ipcMain } = electron;
let win;
const statusPageAPIKey = process.env.STATUSPAGE_API_KEY;
const statusPageID = process.env.STATUSPAGE_ID;

app["devMode"] = true;

console.log(app.getPath("userData"));

if (!fs.existsSync(app.getPath("userData"))) {

    fs.mkdirSync(app.getPath("userData"));

}

const createWindow = () => {
    win = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true,

        }
    })

    if (app.devMode) {
        win.openDevTools();
    }

    win.loadFile('index.html');

}

app.whenReady().then(() => {
    createWindow();

})


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('getUserData', () => { return app.getPath("userData") });

ipcMain.handle('getSubscribers', function getStatuspageSubscribers(perPage = 100, page = 1, subscriberData = []) {


    {

        var config = {
            method: 'get',
            url: `https://api.statuspage.io/v1/pages/${statusPageID}/subscribers?per_page=100&page=${page}`,
            headers: {
                'Authorization': `OAuth ${statusPageAPIKey}`

            }
        };

        axios(config)
            .then(function (response) {

                if (response.data.length === 100) {

                    for (let i = 0; i < response.data.length; i++) {

                        subscriberData.push(response.data[i]);

                    }

                    page += 1;

                    getStatuspageSubscribers(perPage, page, subscriberData);

                } else {

                    for (let i = 0; i < response.data.length; i++) {

                        subscriberData.push(response.data[i]);

                    }
                    // console.log(JSON.stringify(subscriberData));


                    win.webContents.send("subscriberData", subscriberData);

                }


            })
            .catch(function (error) {
                console.log(error);
            });



    }

});

ipcMain.handle('getComponents', function getStatuspageComponents(perPage = 100, page = 1, componentData = []) {

    var config = {
        method: 'get',
        url: `https://api.statuspage.io/v1/pages/${statusPageID}/components?per_page=100&page=${page}`,
        headers: {
            'Authorization': `OAuth ${statusPageAPIKey}`
        }
    };

    axios(config)
        .then(function (response) {

            if (response.data.length === 100) {

                for (let i = 0; i < response.data.length; i++) {

                    componentData.push(response.data[i]);

                }

                page += 1;

                getStatuspageComponents(perPage, page, componentData);

            } else {

                for (let i = 0; i < response.data.length; i++) {

                    componentData.push(response.data[i]);

                }

                win.webContents.send("componentData", componentData);

            }


        })
        .catch(function (error) {
            console.log(error);
        });


});

ipcMain.handle('jQuery', () => {

    let jquery = require('jquery');

    win.webContents.send('jQuery', jquery);

})

ipcMain.handle('dialog', async (event, method, params) => {

    result = await dialog[method](win, params)

    return result;

})

