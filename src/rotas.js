const http = require('http');

const rotas = http.createServer((req, res) => {
    const url = req.url;
    const metodo = req.method;

    if (metodo === 'GET' && url === '/consultas') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(bancodedados.consultas));
    } else if (metodo === 'POST' && url === '/consultas') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            const consulta = JSON.parse(body);
            consulta.identificador = gerarIdentificador();
            bancodedados.consultas.push(consulta);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end();
        });
    } else if (metodo === 'PUT' && url.startsWith('/consultas/')) {
        const identificadorConsulta = parseInt(url.split('/')[2]);
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            const consulta = JSON.parse(body);
            const consultaExistente = bancodedados.consultas.find(consulta => consulta.identificador === identificadorConsulta);
            if (consultaExistente) {
                consultaExistente.dataConsulta = consulta.dataConsulta;
                consultaExistente.horario = consulta.horario;
                consultaExistente.medico = consulta.medico;
                consultaExistente.paciente = consulta.paciente;
                consultaExistente.consultorio = consulta.consultorio;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end();
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ mensagem: "Consulta inexistente!" }));
            }
        });
    } else if (metodo === 'DELETE' && url.startsWith('/consultas/')) {
        const identificadorConsulta = parseInt(url.split('/')[2]);
        const indiceConsulta = bancodedados.consultas.findIndex(consulta => consulta.identificador === identificadorConsulta);
        if (indiceConsulta !== -1) {
            bancodedados.consultas.splice(indiceConsulta, 1);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end();
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensagem: "Consulta inexistente!" }));
        }
    } else if (metodo === 'PATCH' && url.startsWith('/consultas/')) {
        const identificadorConsulta = parseInt(url.split('/')[2]);
        const consultaExistente = bancodedados.consultas.find(consulta => consulta.identificador === identificadorConsulta);
        if (consultaExistente) {
            consultaExistente.finalizada = true;
            bancodedados.consultasFinalizadas.push(consultaExistente);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end();
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensagem: "Consulta inexistente!" }));
        }
    } else if (metodo === 'GET' && url.startsWith('/consultas/')) {
        const identificadorConsulta = parseInt(url.split('/')[2]);
        const consultaExistente = bancodedados.consultas.find(consulta => consulta.identificador === identificadorConsulta);
        if (consultaExistente) {
            const laudo = bancodedados.laudos.find(laudo => laudo.consulta === identificadorConsulta);
            if (laudo) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(laudo));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ mensagem: "Laudo inexistente!" }));
            }
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensagem: "Consulta inexistente!" }));
        }
    } else if (metodo === 'GET' && url.startsWith('/medicos/')) {
        const identificadorMedico = parseInt(url.split('/')[2]);
        const consultas = bancodedados.consultas.filter(consulta => consulta.medico === identificadorMedico);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(consultas));
    } else if (metodo === 'GET' && url === '/laudos') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(bancodedados.laudos));
    } else if (metodo === 'POST' && url === '/laudos') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            const laudo = JSON.parse(body);
            laudo.identificador = gerarIdentificador();
            bancodedados.laudos.push(laudo);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end();
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensagem: "Rota não encontrada!" }));
    }
});