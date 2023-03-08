const db = require('../models');
const bcrypt = require('bcryptjs');
const User = db.User;
const Op = db.Sequelize.Op;

exports.findAll = (req, res) => {
    const searchValue = req.query.searchValue;
    let condition = searchValue
        ? {
              [Op.or]: [
                  { username: { [Op.iLike]: '%' + searchValue + '%' } },
                  { firstName: { [Op.iLike]: '%' + searchValue + '%' } },
                  { lastName: { [Op.iLike]: '%' + searchValue + '%' } },
              ],
          }
        : null;
    User.findAll(
        {
            where: condition,
            attributes: ['id', 'username', 'firstName', 'lastName', 'email'],
        },
        { logging: console.log }
    )
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    'Some error occurred while retrieving users.',
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    User.findByPk({
        id,
        attributes: ['id', 'username', 'firstName', 'lastName', 'email'],
    })
        .then((data) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find User with id=${id}.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: 'Error retrieving User with id=' + id,
            });
        });
};

exports.update = (req, res) => {
    const id = req.userId;
    var user = {
        ...req.body,
    };

    if (req.body.password) {
        user = {
            ...user,
            password: bcrypt.hashSync(req.body.password, 8),
        };
    }

    User.update(user, {
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: 'User was updated successfully.',
                });
            } else {
                res.send({
                    message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: 'Error updating User with id=' + id,
            });
        });
};

exports.setOnline = (userID, isOnline) => {
    User.update(
        {
            isOnline: isOnline,
        },
        {
            where: { id: userID },
        }
    );
};

exports.delete = (req, res) => {
    const id = req.params.id;

    User.destroy({
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: 'User was deleted successfully!',
                });
            } else {
                res.send({
                    message: `Cannot delete User with id=${id}. Maybe User was not found!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: 'Could not delete User with id=' + id,
            });
        });
};

exports.deleteAll = (req, res) => {
    User.destroy({
        where: {},
        truncate: false,
    })
        .then((nums) => {
            res.send({ message: `${nums} User were deleted successfully!` });
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    'Some error occurred while removing all users.',
            });
        });
};
