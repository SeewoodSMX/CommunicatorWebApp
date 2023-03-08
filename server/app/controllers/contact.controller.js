const { User } = require('../models');
const db = require('../models');
const Contact = db.Contact;
const Op = db.Sequelize.Op;

const checkContactExist = (ownerID, contactID) => {
    return Contact.count({
        where: { ownerID: ownerID, contactID: contactID },
    }).then((count) => {
        if (count != 0) {
            return true;
        }
        return false;
    });
};

exports.findAll = (req, res) => {
    const searchValue = req.query.searchValue;
    const userID = req.userId;
    let condition = searchValue
        ? {
              [Op.or]: [
                  { username: { [Op.iLike]: `%${searchValue}%` } },
                  { firstName: { [Op.iLike]: `%${searchValue}%` } },
                  { lastName: { [Op.iLike]: `%${searchValue}%` } },
              ],
          }
        : null;

    Contact.findAll({
        include: [
            {
                model: User,
                as: 'contact',
                where: condition,
                attributes: [
                    'id',
                    'username',
                    'firstName',
                    'lastName',
                    'isOnline',
                ],
            },
        ],
        attributes: ['id', 'additionalDescription'],
        where: { ownerID: userID },
    })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    'Some error occurred while retrieving contacts.',
            });
        });
};

exports.findAllContacts = (socket, next) => {
    const userID = socket.user;

    return Contact.findAll({
        include: [
            {
                model: User,
                as: 'contact',
                attributes: [
                    'id',
                    'username',
                    'firstName',
                    'lastName',
                    'isOnline',
                ],
            },
        ],
        attributes: ['id', 'additionalDescription'],
        where: { ownerID: userID },
    })
        .then((data) => {
            return data;
        })
        .catch((err) => {
            return next(
                new Error(
                    err.message ||
                        'Some error occurred while retrieving contacts.'
                )
            );
        });
};

exports.findOne = (contactID, next) => {
    return Contact.findOne({
        include: [
            {
                model: User,
                as: 'owner',
                attributes: [
                    'id',
                    'username',
                    'firstName',
                    'lastName',
                    'isOnline',
                ],
            },
            {
                model: User,
                as: 'contact',
                attributes: [
                    'id',
                    'username',
                    'firstName',
                    'lastName',
                    'isOnline',
                ],
            },
        ],
        attributes: ['id', 'additionalDescription'],
        where: { id: contactID },
    })
        .then((data) => {
            return data;
        })
        .catch((err) => {
            return next(
                new Error(
                    err.message ||
                        'Some error occurred while retrieving contacts.'
                )
            );
        });
};

exports.create = (params) => {
    const ownerID = params.senderUserID;
    const contactID = params.newContactID;
    const additionalDescription = 'New contact created';
    return checkContactExist(ownerID, contactID).then((contactExist) => {
        if (!contactExist) {
            return (
                Contact.create({
                    additionalDescription: additionalDescription,
                    ownerID: contactID,
                    contactID: ownerID,
                }),
                Contact.create({
                    additionalDescription: additionalDescription,
                    ownerID: ownerID,
                    contactID: contactID,
                }).then((data) => {
                    return data;
                })
            );
        } else {
            new Error('Contact already existing');
        }
    });
};

exports.delete = (params) => {
    console.log(params);
    return Contact.destroy({
        where: {
            [Op.or]: [
                {
                    [Op.and]: [
                        { ownerID: params.ownerID },
                        { contactID: params.contactToDeleteID },
                    ],
                },
                {
                    [Op.and]: [
                        { ownerID: params.contactToDeleteID },
                        { contactID: params.ownerID },
                    ],
                },
            ],
        },
    });
};
