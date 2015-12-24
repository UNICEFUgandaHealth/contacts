var ContactsProvider = require('../app/contacts-provider');
var contactsProvider = new ContactsProvider('mongodb://localhost/unicefcontactstest');

describe("ContactsProvider", function () {

    // REFACTOR: there must be a better way to do this
    beforeEach(function () {
        contactsProvider.deleteAll();
    });

    it("should add a new contact", function (done) {
        contactsProvider.add({ firstName: "test", lastName: "user1", phone: "+254782443432", createdByUserId: 5 }, function (err, newContact) {
            expect(newContact.firstName).toBe("test");
            expect(newContact._id).toBeDefined();
            expect(newContact.createdOn).toBeDefined();
            done();
        });
    });

    it("should edit an existing contact", function (done) {
        contactsProvider.add({ firstName: "test", lastName: "user1", phone: "+254782443432", createdByUserId: 5 }, function (err, addedContact) {
            contactsProvider.edit(addedContact._id, { firstName: "test_edit", lastName: "user1", phone: "+254782443432" }, function (err, editedContact) {
                expect(editedContact.firstName).toBe("test_edit");
                expect(editedContact.lastName).toBe("user1");
                done();
            });
        });
    });

    it("should find all contacts", function (done) {
        var contacts = [
            { firstName: "test", lastName: "user1", phone: "+254782443432" },
            { firstName: "test", lastName: "user2", phone: "+254782443431" }
        ];

        contactsProvider.addAll(contacts, function () {
            contactsProvider.findAll(function (err, contacts) {
                expect(contacts.length).toBe(2);
                done();
            });
        });
    });

    it("should order all contacts by firstName then lastName", function (done) {
        var contacts = [
            { firstName: "test", lastName: "user2", phone: "+254782443431" },
            { firstName: "test", lastName: "user1", phone: "+254782443432" }
        ];

        contactsProvider.addAll(contacts, function () {
            contactsProvider.findAll(function (err, contacts) {
                expect(contacts[0].lastName).toEqual("user1");
                expect(contacts[1].lastName).toEqual("user2");
                done();
            });
        });
    });

    it("should find contacts by firstName", function (done) {
        var contacts = [
            { firstName: "test", lastName: "user1", phone: "+254782443432" },
            { firstName: "test1", lastName: "user2", phone: "+254782443431" }
        ];

        contactsProvider.addAll(contacts, function () {
            contactsProvider.find('Test', function (err, contacts) {
                expect(contacts.length).toBe(2);
                done();
            });
        });
    });

    it("should find contact by phone number", function (done) {
        var contacts = [
            { firstName: "test", lastName: "user1", phone: "+254782443432" },
            { firstName: "test1", lastName: "user2", phone: "+25477555555" }
        ];

        contactsProvider.addAll(contacts, function () {
            contactsProvider.find("+25477555555", function (err, contact) {
                expect(contact[0].phone).toEqual("+25477555555");
                done();
            });
        });
    });

    it("should order by firstName then lastName", function (done) {
        var contacts = [
            { firstName: "test", lastName: "user1", phone: "+254782443432" },
            { firstName: "test2", lastName: "user3", phone: "+254782422431" },
            { firstName: "test1", lastName: "user3", phone: "+254782427431" }
        ];

        contactsProvider.addAll(contacts, function () {
            contactsProvider.find('Ser3', function (err, contacts) {
                expect(contacts.length).toBe(2);
                expect(contacts[0].firstName).toEqual("test1");
                expect(contacts[1].firstName).toEqual("test2");
                done();
            });
        });

    });

    it("should find contacts by lastName", function (done) {
        var contacts = [
            { firstName: "test", lastName: "user1", phone: "+254782443432" },
            { firstName: "test1", lastName: "user3", phone: "+254782422431" }
        ];

        contactsProvider.addAll(contacts, function () {
            contactsProvider.find('Ser3', function (err, contacts) {
                expect(contacts.length).toBe(1);
                done();
            });
        });
    });

    it("should find contact by id", function (done) {
        var contact = { firstName: "test", lastName: "user1", phone: "+254782443436", createdByUserId: 5 };

        contactsProvider.add(contact, function (err, addedContact) {
            contactsProvider.findById(addedContact._id, function (err, foundContact) {
                expect(foundContact._id).toEqual(addedContact._id);
                done();
            });
        });
    });

    it("should delete a contact by id", function (done) {
        var contacts = [
            { firstName: "test", lastName: "user1", phone: "+254782443432" },
            { firstName: "test1", lastName: "user3", phone: "+254782422431" }
        ];

        contactsProvider.addAll(contacts, function () {
            contactsProvider.findAll(function (err, foundContacts) {
                var contactToDelete = foundContacts[0];

                contactsProvider.delete(contactToDelete._id, function () {
                    contactsProvider.findAll(function (err, contacts) {
                        expect(contacts.length).toBe(1);
                        done();
                    });
                });
            });
        });

    });
});
