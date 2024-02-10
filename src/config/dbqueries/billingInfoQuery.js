
exports.billingInfoDCAQuery = () => {
  return `
    select BA.BA_ACCOUNT_NO,replace(TO_Char(STATEMENT_DATE,'dd/MM/yyyy'),'') InvoiceDate,
    legal_invoice_no InvoiceNumber,replace(TO_Char(DUE_DATE,'dd/MM/yyyy'),'') PayBy,
    nvl(PREV_BALANCE_AMT,0) prev_balance,
    nvl(TOTAL_FINANCE_ACT,0) Payment,
    nvl(PREV_BALANCE_AMT+TOTAL_FINANCE_ACT,0) OverDue_Charges,
    NVL(Total_Amt_due-(PREV_BALANCE_AMT+TOTAL_FINANCE_ACT),0) New_Charges,
    TOTAL_AMT_DUE as Total_Amt_due,
    BS.CYCLE_SEQ_NO,BCC.Cycle_code
    from    BL1_BILL_STATEMENT BS,
        BL1_BLNG_ARRANGEMENT BA,
    BL1_CYCLE_CONTROL BCC
    where   BS.BA_NO=BA.BA_NO
    and     BCC.CYCLE_SEQ_NO=BS.CYCLE_SEQ_NO
    and     BA.BA_ACCOUNT_NO=:account_id order by STATEMENT_DATE desc
    `;
};

exports.billingInfoWinleadQuery = () => {
  return `
    select BA.BA_ACCOUNT_NO,replace(TO_Char(STATEMENT_DATE,'dd/MM/yyyy'),'') InvoiceDate,
    legal_invoice_no InvoiceNumber,replace(TO_Char(DUE_DATE,'dd/MM/yyyy'),'') PayBy,
    nvl(PREV_BALANCE_AMT,0) prev_balance,
    nvl(TOTAL_FINANCE_ACT,0) Payment,
    nvl(PREV_BALANCE_AMT+TOTAL_FINANCE_ACT,0) OverDue_Charges,
    NVL(Total_Amt_due-(PREV_BALANCE_AMT+TOTAL_FINANCE_ACT),0) New_Charges,
    TOTAL_AMT_DUE as Total_Amt_due,
    BS.CYCLE_SEQ_NO,BCC.Cycle_code
    from    BL1_BILL_STATEMENT BS,
        BL1_BLNG_ARRANGEMENT BA,
    BL1_CYCLE_CONTROL BCC
    where   BS.BA_NO=BA.BA_NO
    and     BCC.CYCLE_SEQ_NO=BS.CYCLE_SEQ_NO
    and     BA.BA_ACCOUNT_NO=:account_id order by STATEMENT_DATE desc
    `;
};

exports.billingDetailsWinleadQuery = () => {
  return `
  select  SMC,ChargeCode,DESCRIPTION, CONCAT(CONCAT(pStDate,' - '),pEdDate) Period, AMOUNT, GST, Total
  from   (select S.PRIM_RESOURCE_VAL SMC,BC.CYCLE_SEQ_NO, BC.EFFECTIVE_DATE,BC.CHARGE_CODE ChargeCode, CC.DESCRIPTION,
        /*oms.get_dyn_value(BC.DYNAMIC_ATTRIBUTE,'Period Start Date') pStDate, oms.get_dyn_value(BC.DYNAMIC_ATTRIBUTE,'Period End Date') pEdDate,*/
        to_date(getdyna(BC.DYNAMIC_ATTRIBUTE,'Period Start Date'),'yyyymmdd') pStDate, to_date(getdyna(BC.DYNAMIC_ATTRIBUTE,'Period End Date'),'yyyymmdd') pEdDate,
        AMOUNT,round(AMOUNT*.06,2) GST,
        AMOUNT+round(AMOUNT*.06,2) Total,S.sub_status,s.SUBSCRIBER_NO,s.CUSTOMER_ID,BC.SERVICE_RECEIVER_TYPE,
        BC.RECEIVER_CUSTOMER, BC.SERVICE_RECEIVER_ID
    from   BL1_CHARGE BC,
        BL1_CHARGE_CODE CC,
        SUBSCRIBER  S
    where  BC.RECEIVER_CUSTOMER in(select customer_no from AR1_ACCOUNT where ACCOUNT_ID=:account_id)  AND      
    BC.CYCLE_SEQ_NO=:sequence_no AND
    --BC.CUSTOMER_KEY=BC.RECEIVER_CUSTOMER+100 AND
    BC.CHARGE_CODE = CC.CHARGE_CODE AND
    S.SUBSCRIBER_NO=BC.SERVICE_RECEIVER_ID AND
    BC.SERVICE_RECEIVER_TYPE='S'
    union all
    select null SMC,BC.CYCLE_SEQ_NO,
        BC.EFFECTIVE_DATE,BC.CHARGE_CODE ChargeCode, CC.DESCRIPTION,
        to_date(BC.EFFECTIVE_DATE,'dd/mm/yy') pStDate,   null pEdDate,
        AMOUNT AMOUNT,
        round(AMOUNT*.06,2) GST,
        AMOUNT+round(AMOUNT*.06,2) Total,null sub_status,null SUBSCRIBER_NO,RECEIVER_CUSTOMER CUSTOMER_ID,BC.SERVICE_RECEIVER_TYPE,
        BC.RECEIVER_CUSTOMER,BC.SERVICE_RECEIVER_ID
    from   BL1_CHARGE BC, BL1_CHARGE_CODE CC
    where  BC.RECEIVER_CUSTOMER in(select customer_no from AR1_ACCOUNT where ACCOUNT_ID=:account_id) AND        
    BC.CYCLE_SEQ_NO=:sequence_no AND        
    BC.CHARGE_CODE = CC.CHARGE_CODE AND
    BC.SERVICE_RECEIVER_ID=BC.SERVICE_RECEIVER_ID AND --BC.CUSTOMER_KEY=BC.RECEIVER_CUSTOMER+100 AND
    BC.SERVICE_RECEIVER_TYPE='B' ) AA
  `;
};
