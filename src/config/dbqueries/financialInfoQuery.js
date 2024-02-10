exports.financialInfoQuery = () => {
  return `
    select REPLACE(TO_CHAR(credit_date,'mm/dd/yyyy'),'') "Post Date", 
    CREDIT_ID "Transaction Code", 
    credit_reason "Description", 
    cr_attrib_name "TrnsType", 
    amount+tax_amount "Amount", 
    Application_ID "User ID"
    from 
    AR1_CUSTOMER_CREDIT 
    where account_ID=:account_id order by credit_date desc
    `;
};

exports.dcaFinancialInfoQuery = () => {
  return `
    select REPLACE(TO_CHAR(credit_date,'mm/dd/yyyy'),'') "Post Date", 
    CREDIT_ID "Transaction Code", 
    credit_reason "Description", 
    cr_attrib_name "TrnsType", 
    amount+tax_amount "Amount", 
    Application_ID "User ID"
    from 
    AR1_CUSTOMER_CREDIT 
    where account_ID=:account_id order by credit_date desc
    `;
};
