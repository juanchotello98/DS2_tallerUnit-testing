/* global describe it */
var sinon = require('sinon')
var assert = require('assert')
var user = require('../app/user.js')
var Database = require('../app/database')
var Government = require('../app/government')

describe('User Tests', function () {
    it('should call save once', function () {
        var save = sinon.spy(Database, 'save')
        
        user.setupNewUser({ name: 'test' }, function () { })

        save.restore()
        sinon.assert.calledOnce(save)
    })
    
    it('should pass object with correct values to save only once', function () {
        var info = { name: 'test' }
        var expectedUser = {
            name: info.name,
            nameLowercase: info.name.toLowerCase()
        }
        var database = sinon.mock(Database)
        database.expects('save').once().withArgs(expectedUser)

        user.setupNewUser(info, function () { })
        
        database.verify()
        database.restore()
    })

    it('should return tax base value', function () {
        var government = sinon.spy(Government, 'taxBase')
        var tax = user.taxCalculation({ age: 10 })

        assert.equal(tax, 200)
        government.restore()
        sinon.assert.calledOnce(government)
    })

    it('should return custom tax base value', function () {
        var government = sinon.stub(Government, 'taxBase').returns(40)
        
        var tax = user.taxCalculation({ age: 10 })

        assert.equal(tax, 400)
        government.restore()
        sinon.assert.calledOnce(government)
    })

    it('should return custom tax base value only if age is 10', function () {
        var info = { age: 10 }

        var government = sinon.mock(Government)
        government.expects('taxBase').once().withArgs(10).returns(30)

        var tax = user.taxCalculation(info)
        assert.equal(tax, 300)
        government.verify()
        government.restore()
    })
})
