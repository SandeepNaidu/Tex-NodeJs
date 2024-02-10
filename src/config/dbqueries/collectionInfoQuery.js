// RNL DB
exports.collectionInfoWinleadQuery = () => {
  return `
    select account_Id, PasDueAmount "Amount Due", ar_balance-PasDueAmount as "Current Charges",ar_balance "AR Balance",
    sum(bucket_1) "1 - 30", sum(bucket_2) "31 - 60", sum(bucket_3) "61 - 90", sum(bucket_4) "> 90"
    from  (select ac.account_id,
    sum(case when ((trunc(sysdate) -trunc(a.due_date)) +30 -1) >30 then a.balance else 0 end) over(partition by a.account_id) PasDueAmount, ac.ar_balance,
    max((trunc(sysdate) -trunc(a.due_date)) +30 -1) over(partition by a.account_id) DebtAge,
    sum(a.balance) over(partition by a.account_id) TotalOSAmount,((trunc(sysdate) -trunc(a.due_date)) +30 -1) Invdebtage,
    a.balance,
    case when (trunc(sysdate) -trunc(a.due_date)) +30 -1 between 1 and 30 then a.balance else 0 end bucket_1,
    case when (trunc(sysdate)- trunc(a.due_date)) +30 -1 between 31 and 60 then a.balance else 0 end bucket_2,
    case when (trunc(sysdate) - trunc(a.due_date)) +30 -1 between 61 and 90 then a.balance else 0 end bucket_3,
    case when (trunc(sysdate) - trunc(a.due_date)) +30 -1 > 90 then a.balance else 0 end bucket_4
    from ar1_account ac LEFT OUTER JOIN
    (select a.account_id ,invoice_id ,
    sum(charges_amount) charges_amount, min(due_date) due_date,
    min(creation_date) creation_date, sum(balance) balance
    from AR1_CHARGE_GROUP a
    where balance > 0
    and   a.account_id =:account_id
    group by a.account_id ,invoice_id
    --having sum(balance) > 10
    ) a on (a.account_id = ac.ACCOUNT_ID)
    where ac.account_id=:account_id) a
    group by account_Id,PasDueAmount,ar_balance
    `;
};
exports.collectionInfoDCAQuery = () => {
  return `
    select account_Id, PasDueAmount "Amount Due", ar_balance-PasDueAmount as "Current Charges",ar_balance "AR Balance",
    sum(bucket_1) "1 - 30", sum(bucket_2) "31 - 60", sum(bucket_3) "61 - 90", sum(bucket_4) "> 90"
    from  (select ac.account_id,
    sum(case when ((trunc(sysdate) -trunc(a.due_date)) +30 -1) >30 then a.balance else 0 end) over(partition by a.account_id) PasDueAmount, ac.ar_balance,
    max((trunc(sysdate) -trunc(a.due_date)) +30 -1) over(partition by a.account_id) DebtAge,
    sum(a.balance) over(partition by a.account_id) TotalOSAmount,((trunc(sysdate) -trunc(a.due_date)) +30 -1) Invdebtage,
    a.balance,
    case when (trunc(sysdate) -trunc(a.due_date)) +30 -1 between 1 and 30 then a.balance else 0 end bucket_1,
    case when (trunc(sysdate)- trunc(a.due_date)) +30 -1 between 31 and 60 then a.balance else 0 end bucket_2,
    case when (trunc(sysdate) - trunc(a.due_date)) +30 -1 between 61 and 90 then a.balance else 0 end bucket_3,
    case when (trunc(sysdate) - trunc(a.due_date)) +30 -1 > 90 then a.balance else 0 end bucket_4
    from ar1_account ac LEFT OUTER JOIN
    (select a.account_id ,invoice_id ,
    sum(charges_amount) charges_amount, min(due_date) due_date,
    min(creation_date) creation_date, sum(balance) balance
    from AR1_CHARGE_GROUP a
    where balance > 0
    and   a.account_id =:account_id
    group by a.account_id ,invoice_id
    --having sum(balance) > 10
    ) a on (a.account_id = ac.ACCOUNT_ID)
    where ac.account_id=:account_id) a
    group by account_Id,PasDueAmount,ar_balance
    `;
};
