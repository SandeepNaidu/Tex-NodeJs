exports.paymentInfoDCAQuery = () => {
  return `SELECT
  D.payment_method "Method",
  Replace(To_char(D.deposit_date, 'mm/dd/yyyy'), '')      "DepositDate",
  Replace(To_char(A.sys_creation_date, 'mm/dd/yyyy'), '') "PostDate",
  A.amount "Amount",
  D.payment_source_id "SourceID",
  D.check_no  "CheckNo",
  D.l9_transaction_id  "BankTransactionID",
  D.reversal_reason "RevRsn",
  D.PAYMENT_SOURCE_TYPE SOURCE_TYPE,
  D.BANK_CODE,
  D.BANK_ACCOUNT_NUMBER,
  B.ACTIVITY_TYPE
FROM AR1_PAYMENT A
  LEFT JOIN AR1_PAYMENT_ACTIVITY B ON A.CREDIT_ID = B.CREDIT_ID
  INNER JOIN AR1_PAYMENT_DETAILS D ON D.PAYMENT_ID = A.PAYMENT_ID
WHERE A.ACCOUNT_ID = :account_id
ORDER  BY D.deposit_date DESC `;
};
// AND A.PERIOD_KEY = D.PERIOD_KEY AND A.PARTITION_ID = D.PARTITION_ID

exports.paymentInfoQuery = () => {
  return `SELECT a.payment_method                             "Method",
      Replace(To_char(a.deposit_date, 'mm/dd/yyyy'), '')      "DepositDate",
      Replace(To_char(a.sys_creation_date, 'mm/dd/yyyy'), '') "PostDate",
      a.amount                                                "Amount",
      a.payment_source_id                                     "SourceID",
      a.check_no                                              "CheckNo",
      a.l9_transaction_id                                     "BankTransactionID",
      a.reversal_reason                                       "RevRsn",
      c.ACTIVITY_TYPE,
      b.amount "test_amount"
    FROM AR1_PAYMENT B
    LEFT JOIN AR1_PAYMENT_ACTIVITY C ON C.CREDIT_ID = B.CREDIT_ID
    INNER JOIN AR1_PAYMENT_DETAILS A ON A.PAYMENT_ID = B.PAYMENT_ID
    WHERE  a.account_id = :account_id
      AND b.amount > 0
    ORDER  BY a.deposit_date DESC `;
};
// AND B.PERIOD_KEY = A.PERIOD_KEY AND B.PARTITION_ID = A.PARTITION_ID

// exports.paymentInfoDCAQuery = () => {
//   return `SELECT a.payment_method                             "Method",
//       Replace(To_char(a.deposit_date, 'mm/dd/yyyy'), '')      "DepositDate",
//       Replace(To_char(a.sys_creation_date, 'mm/dd/yyyy'), '') "PostDate",
//       a.amount                                                "Amount",
//       a.payment_source_id                                     "SourceID",
//       a.check_no                                              "CheckNo",
//       a.l9_transaction_id                                     "BankTransactionID",
//       a.reversal_reason                                       "RevRsn",
//       c.ACTIVITY_TYPE,
//       b.amount "test_amount"
//     FROM AR1_PAYMENT B
//     LEFT JOIN AR1_PAYMENT_ACTIVITY C ON C.CREDIT_ID = B.CREDIT_ID
//     INNER JOIN AR1_PAYMENT_DETAILS A ON A.PAYMENT_ID = B.PAYMENT_ID
//     WHERE  a.account_id = :account_id
//       AND b.amount > 0
//     ORDER  BY a.deposit_date DESC `;
// };
