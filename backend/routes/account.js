const express = require('express');
const mongoose = require('mongoose');
const { authMiddleware } = require('../middleware.js');
const { Account } = require('../db.js')

const router = express.Router();

router.get('/balance', authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    })

    res.json({
        balance: "account balance is " + account.balance,
    })
})

router.post('/transfer', authMiddleware, async (req, res) => {

    const session = await mongoose.startSession(); //starting a session to start a transaction

    session.startTransaction(); //transaction begins. Everything between this line and where the transaction commits is
    //executed in one single go. If it can't be that way, it is not executed at all.


    const { amount, to } = req.body;

    // const account = await Account.findOne({
    //     userId: req.userId
    // })

    const account = await Account.findOne({ userId: req.userId }).session(session);


    // if (account.balance < amount) {
    //     res.status(400).json({
    //         message: "Insufficient Balance"
    //     })
    // }

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    // const toAccount = Account.findOne({
    //     userId: to,
    // })

    // if (!toAccount) {
    //     res.status(400).json({
    //         message: "Invalid Account"
    //     })
    // }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    // await Account.updateOne({
    //     userId: req.userId
    // }, {
    //     $inc: {
    //         balance: -amount,
    //     }
    // })

    // await Account.updateOne({
    //     userId: to
    // }, {
    //     $inc: {
    //         balance: amount,
    //     }
    // })

    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    await session.commitTransaction();


    res.json({
        message: "Transfer successful"
    })
})

module.exports = router;