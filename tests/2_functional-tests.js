const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { get } = require('../server');

chai.use(chaiHttp);

let getId='';


suite('Functional Tests', function() {
    before(function() {
        
        chai.request(server).post('/api/issues/:project')
          .send({"issue_title":"Faux Issue Title","issue_text":"Only","created_by":"fC"})
          .end(function (err, res) {
            console.log('test 0: ', res.body, '\n');
            //done();
        });

        chai.request(server).get('/api/issues/:project')
          .end(function (err, res) {
            getId = res.body[0]._id;
            console.log('getId1', getId);
            //done();
        });

    });

    test('it should create an issue with every field', function(done) {
        chai.request(server).post('/api/issues/:project')
        .send({"_id":"1666245555708","issue_title":"Faux Issue Title","issue_text":"Functional Test - Required Fields Only","created_by":"fCC","assigned_to":"","status_text":"","open":true,"created_on":"2022-10-20T05:59:15.707Z","updated_on":"2022-10-20T05:59:15.707Z"})
        .end(function (err, res) {
            console.log('test 1: ', res.body, '\n');
            assert.equal(Object.keys(res.body).length, 9);
            done();
        });
    });
    test('it should create an issue with only required fields', function(done) {
        chai.request(server).post('/api/issues/:project')
        .send({"issue_title":"Faux Issue Title","issue_text":"Only","created_by":"fC"})
        .end(function (err, res) {
            console.log('test 2: ', res.body, '\n');
            assert.exists(res.body.issue_title);
            assert.exists(res.body.issue_text);
            assert.exists(res.body.created_by);
            done();
        });
    });
    test('it should create an issue with missing required fields', function(done) {
        chai.request(server).post('/api/issues/:project')
        .send({"_id":"1666245555708","assigned_to":"","status_text":"","open":true,"created_on":"2022-10-20T05:59:15.707Z","updated_on":"2022-10-20T05:59:15.707Z"})
        .end(function (err, res) {
            console.log('test 3: ', res.body, '\n');
            assert.equal(res.body.error, 'required field(s) missing');
            done();
        });
    });
    test('it should view issues on a project:', function(done) {
        chai.request(server).get('/api/issues/:project')
        .end(function (err, res) {
            console.log('test 4: ', res.body, '\n');
            assert.equal(Object.keys(res.body[0]).length, 9);
            done();
        });
    });
    test('it should view issues on a project with one filter:', function(done) {
        chai.request(server).get('/api/issues/:project?open=true')
        .end(function (err, res) {
            console.log('test 5: ', res.body, '\n');
            assert.exists(res.body);
            done();
        });
    });
    test('it should view issues on a project with multiple filters:', function(done) {
        chai.request(server).get('/api/issues/:project?open=true&created_by=fC')
        .end(function (err, res) {
            console.log('test 6: ', res.body, '\n');
            assert.exists(res.body);
            done();
        });
    });
    test('it should update one field on an issue', function(done) {
        chai.request(server).put('/api/issues/:project')
        .send({_id: getId, issue_title:"titleUpdated"})
        .end(function (err, res) {
            //console.log('getId: ', getId);
            console.log('test 7: ', res.body, '\n');
            assert.equal(res.body.result, 'successfully updated');
            done();
        });
    });
    test('it should update multiple fields on an issue', function(done) {
        chai.request(server).put('/api/issues/:project')
        .send({_id: getId, issue_title:"titleUpdated", issue_text:"textUpdated"})
        .end(function (err, res) {
            console.log('test 8: ', res.body, '\n');
            assert.equal(res.body.result, 'successfully updated');
            done();
        });
    });
    test('it should update an issue with missing _id', function(done) {
        chai.request(server).put('/api/issues/:project')
        .send({issue_title:"title", issue_text:"text"})
        .end(function (err, res) {
            console.log('test 9: ', res.body, '\n');
            assert.equal(res.body.error, 'missing _id');
            done();
        });
    });
    test('it should update an issue with with no fields to update', function(done) {
        chai.request(server).put('/api/issues/:project')
        .send({_id: getId})
        .end(function (err, res) {
            console.log('test 10: ', res.body, '\n');
            assert.equal(res.body.error, 'no update field(s) sent');
            done();
        });
    });
    test('it should update an issue with an invalid _id ', function(done) {
        chai.request(server).put('/api/issues/:project')
        .send({_id: 'id', issue_title:"title2"})
        .end(function (err, res) {
            console.log('test 11: ', res.body, '\n');
            assert.equal(res.body.error, 'could not update');
            done();
        });
    });
    test('it should delete an issue ', function(done) {
        chai.request(server).delete('/api/issues/:project')
        .send({_id: getId})
        .end(function (err, res) {
            console.log('test 12: ', res.body, '\n');
            assert.equal(res.body.result, 'successfully deleted');
            done();
        });
    });
    test('it should delete an issue with an invalid _id', function(done) {
        chai.request(server).delete('/api/issues/:project')
        .send({_id: 'getId'})
        .end(function (err, res) {
            console.log('test 13: ', res.body, '\n');
            assert.equal(res.body.error, 'could not delete');
            done();
        });
    });
    test('it should delete an issue with missing _id ', function(done) {
        chai.request(server).delete('/api/issues/:project')
        .send({})
        .end(function (err, res) {
            console.log('test 14: ', res.body, '\n');
            assert.equal(res.body.error, 'missing _id');
            done();
        });
    });
    
  
});
