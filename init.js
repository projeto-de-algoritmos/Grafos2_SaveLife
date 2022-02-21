const prompt = require('prompt');
const axios = require('axios');
const XMLHttpRequest = require('xhr2');

const secretKey = '$2b$10$jxow4GADDMrolpxvMGbFcOqDcqkAYAykopUHA6Obtp9i8z0si6n3u';
const url = `https://api.jsonbin.io/b/`;

const endpoints = {
    'df': `${url}62138f0aca70c44b6ea21400/latest`,
}

const requestData = (uf) => {

    const states = Object.keys(endpoints)

    if (!states.includes(uf)) {
        console.log('Não temos dados para este estado!');
        return;
    }

    return new Promise((resolve, reject) => {
        const xml = new XMLHttpRequest();

        xml.responseType = 'json';
        xml.onload = () => {
            if (xml.status === 200)
                resolve(xml.response);
            else
                reject('Erro interno!');
        }
        xml.open('GET', endpoints[uf]);
        xml.setRequestHeader('secret-key', secretKey);
        xml.send();
    });
}

const transformData = async (data) => {
    //Fazer transformações necessárias

    return data;
}

const init = async () => {
    prompt.start();

    prompt.get(['state', 'ip'], function (err, result) {

        console.log('Command-line input received:');
        console.log('  state: ' + result.state);
        console.log('  ip: ' + result.ip);

        requestData(result.state).then(async onfulfilled => {
            let deserializedData = await transformData(onfulfilled);

            /*
            //Mandar dados para a estrutura de dados e gerar a MST
            graphStructure(await deserializedData);

            //Percorrer MST e retornar UBS's para o usuário
            queryData();
            */
        }).catch(onrejected => console.log(onrejected));
        return;
    });


}

init();