// RNL DB
exports.accountInfoQuery = () => {
  return `SELECT * FROM (
    SELECT a.*,
    c.x_id "IC Number",
    c.x_id_type "IC Type",
    CASE WHEN c.x_vip_indicator=1 THEN
    NVL(CASE WHEN UPPER(trim((SELECT title FROM table_hgbst_elm@bill_to_crm WHERE objid=c.x_vip_cat2hgbst_elm AND ROWNUM=1))) = 'PLEASE SPECIFY' THEN NULL ELSE(SELECT title FROM table_hgbst_elm@bill_to_crm WHERE objid=c.x_vip_cat2hgbst_elm AND ROWNUM=1) END, (SELECT title FROM table_hgbst_elm@bill_to_crm WHERE s_title = 'VIP' AND ROWNUM=1))
    ELSE (SELECT title FROM table_hgbst_elm@bill_to_crm WHERE s_title = 'NON-VIP' AND ROWNUM=1) END "VIP Status",
    row_number() over(PARTITION BY a.objid ORDER BY cr.s_role_name DESC, cr.contact_role2contact DESC) rn
    FROM
    (
    SELECT
    DISTINCT ac.account_id  "Account ID",
    '0'||ac.account_id||check_digit(ac.account_id*1) "10 digit Account ID",
    bo.name "Account Name",
    bo.x_blg_cust_type "Customer Type",
    ba.x_charge_freq "Bill Frequency",
    (SELECT    a.extract_date || ' - ' || gc.description
    FROM ar1_direct_debit_request a, ar1_generic_codes gc
    WHERE a.account_id = ac.account_id
    AND extract_date = (SELECT MAX (extract_date) FROM ar1_direct_debit_request x WHERE x.account_id = a.account_id)
    AND gc.code(+) = a.request_status AND ROWNUM=1) "Last CC/DD Extraction",
    CASE WHEN pc.payment_method = 'SL' THEN
    'Salary Deduction'
    ELSE (SELECT gc.description FROM ar1_generic_codes gc WHERE TYPE='PAYMENT_METHOD' AND code=trim(pc.payment_method)) END "Payment Type",
    ac.ar_balance "AR Balance",
    CASE WHEN (SELECT COUNT (0) FROM subscriber s WHERE s.customer_id = ac.customer_no AND sub_status = 'A') > 0 THEN 'A'
    ELSE 'S' END "Account Status",
    bl.cycle_code "Bill Cycle Code", new_cycle "New Bill Cycle Code",
    TO_CHAR (bl.old_cycle_exp_date, 'dd-Mon-yyyy') "Old Bill Cycle Exp Date",
    ba.bar_id, bo.objid
    FROM
    table_bus_org@bill_to_crm bo,
    table_con_blg_argmnt_role@bill_to_crm cbar,
    table_blg_argmnt@bill_to_crm ba,
    ar1_account ac, bl1_customer bl, ar1_pay_channel pc
    WHERE
    bo.objid=cbar.ba_account2bus_org
    AND cbar.ba_role2blg_argmnt=ba.objid
    AND bo.org_id=ac.account_id
    AND ac.customer_no=bl.customer_id
    AND ac.account_id=pc.account_id
    AND cbar.active=1
    AND bo.s_org_id= :account_id ) a left join table_contact_role@bill_to_crm cr ON a.objid=cr.contact_role2bus_org
    left join table_contact@bill_to_crm c ON cr.contact_role2contact=c.objid
  ) WHERE rn=1`;
};
// RNL DB
exports.accountInfoDCAQuery = () => {
  return `
  SELECT * FROM (
    SELECT a.*,
    c.x_id "IC Number",
    c.x_id_type "IC Type",
    NVL((select NVL(STATUS_CODE,'NO') from (select row_number() over(partition by entity_id order by pa_id desc) RN , status_code
    from  CL1_PA a where ENTITY_ID=:account_id) AA where RN=1),'NO') "PTPViolated#",
    CASE WHEN c.x_vip_indicator=1 THEN
    NVL(CASE WHEN UPPER(trim((SELECT title FROM table_hgbst_elm@bill_to_crm WHERE objid=c.x_vip_cat2hgbst_elm AND ROWNUM=1))) = 'PLEASE SPECIFY' THEN NULL ELSE(SELECT title FROM table_hgbst_elm@bill_to_crm WHERE objid=c.x_vip_cat2hgbst_elm AND ROWNUM=1) END, (SELECT title FROM table_hgbst_elm@bill_to_crm WHERE s_title = 'VIP' AND ROWNUM=1))
    ELSE (SELECT title FROM table_hgbst_elm@bill_to_crm WHERE s_title = 'NON-VIP' AND ROWNUM=1) END "VIP Status",
    row_number() over(PARTITION BY a.objid ORDER BY cr.s_role_name DESC, cr.contact_role2contact DESC) rn
    FROM
    (
    SELECT
    DISTINCT ac.account_id  "Account ID",
    '0'||ac.account_id||check_digit(ac.account_id*1) "10 digit Account ID",
    bo.name "Account Name",
    bo.x_blg_cust_type "Customer Type",
    ba.x_charge_freq "Bill Frequency",
    (SELECT    a.extract_date || ' - ' || gc.description
    FROM ar1_direct_debit_request a, ar1_generic_codes gc
    WHERE a.account_id = ac.account_id
    AND extract_date = (SELECT MAX (extract_date) FROM ar1_direct_debit_request x WHERE x.account_id = a.account_id)
    AND gc.code(+) = a.request_status AND ROWNUM=1) "Last CC/DD Extraction",
    CASE WHEN pc.payment_method = 'SL' THEN
    'Salary Deduction'
    ELSE (SELECT gc.description FROM ar1_generic_codes gc WHERE TYPE='PAYMENT_METHOD' AND code=trim(pc.payment_method)) END "Payment Type",
    ac.ar_balance "AR Balance",
    CASE WHEN (SELECT COUNT (0) FROM subscriber s WHERE s.customer_id = ac.customer_no AND sub_status = 'A') > 0 THEN 'A'
    ELSE 'S' END "Account Status",
    bl.cycle_code "Bill Cycle Code", new_cycle "New Bill Cycle Code",
    TO_CHAR (bl.old_cycle_exp_date, 'dd-Mon-yyyy') "Old Bill Cycle Exp Date",
    ba.bar_id, bo.objid
    FROM
    table_bus_org@bill_to_crm bo,
    table_con_blg_argmnt_role@bill_to_crm cbar,
    table_blg_argmnt@bill_to_crm ba,
    ar1_account ac, bl1_customer bl, ar1_pay_channel pc
    WHERE
    bo.objid=cbar.ba_account2bus_org
    AND cbar.ba_role2blg_argmnt=ba.objid
    AND bo.org_id=ac.account_id
    AND ac.customer_no=bl.customer_id
    AND ac.account_id=pc.account_id
    AND cbar.active=1
    AND bo.s_org_id= :account_id ) a left join table_contact_role@bill_to_crm cr ON a.objid=cr.contact_role2bus_org
    left join table_contact@bill_to_crm c ON cr.contact_role2contact=c.objid
  ) WHERE rn=1
  `;
};
exports.accountInfoWinleadQuery = () => {
  return `
  SELECT * FROM (
    SELECT a.*,
    c.x_id "IC Number",
    c.x_id_type "IC Type",
    NVL((select NVL(STATUS_CODE,'NO') from (select row_number() over(partition by entity_id order by pa_id desc) RN , status_code
    from  CL1_PA a where ENTITY_ID=:account_id) AA where RN=1),'NO') "PTPViolated#",
    CASE WHEN c.x_vip_indicator=1 THEN
    NVL(CASE WHEN UPPER(trim((SELECT title FROM table_hgbst_elm@bill_to_crm WHERE objid=c.x_vip_cat2hgbst_elm AND ROWNUM=1))) = 'PLEASE SPECIFY' THEN NULL ELSE(SELECT title FROM table_hgbst_elm@bill_to_crm WHERE objid=c.x_vip_cat2hgbst_elm AND ROWNUM=1) END, (SELECT title FROM table_hgbst_elm@bill_to_crm WHERE s_title = 'VIP' AND ROWNUM=1))
    ELSE (SELECT title FROM table_hgbst_elm@bill_to_crm WHERE s_title = 'NON-VIP' AND ROWNUM=1) END "VIP Status",
    row_number() over(PARTITION BY a.objid ORDER BY cr.s_role_name DESC, cr.contact_role2contact DESC) rn
    FROM
    (
    SELECT
    DISTINCT ac.account_id  "Account ID",
    '0'||ac.account_id||check_digit(ac.account_id*1) "10 digit Account ID",
    bo.name "Account Name",
    bo.x_blg_cust_type "Customer Type",
    ba.x_charge_freq "Bill Frequency",
    (SELECT    a.extract_date || ' - ' || gc.description
    FROM ar1_direct_debit_request a, ar1_generic_codes gc
    WHERE a.account_id = ac.account_id
    AND extract_date = (SELECT MAX (extract_date) FROM ar1_direct_debit_request x WHERE x.account_id = a.account_id)
    AND gc.code(+) = a.request_status AND ROWNUM=1) "Last CC/DD Extraction",
    CASE WHEN pc.payment_method = 'SL' THEN
    'Salary Deduction'
    ELSE (SELECT gc.description FROM ar1_generic_codes gc WHERE TYPE='PAYMENT_METHOD' AND code=trim(pc.payment_method)) END "Payment Type",
    ac.ar_balance "AR Balance",
    CASE WHEN (SELECT COUNT (0) FROM subscriber s WHERE s.customer_id = ac.customer_no AND sub_status = 'A') > 0 THEN 'A'
    ELSE 'S' END "Account Status",
    bl.cycle_code "Bill Cycle Code", new_cycle "New Bill Cycle Code",
    TO_CHAR (bl.old_cycle_exp_date, 'dd-Mon-yyyy') "Old Bill Cycle Exp Date",
    ba.bar_id, bo.objid
    FROM
    table_bus_org@bill_to_crm bo,
    table_con_blg_argmnt_role@bill_to_crm cbar,
    table_blg_argmnt@bill_to_crm ba,
    ar1_account ac, bl1_customer bl, ar1_pay_channel pc
    WHERE
    bo.objid=cbar.ba_account2bus_org
    AND cbar.ba_role2blg_argmnt=ba.objid
    AND bo.org_id=ac.account_id
    AND ac.customer_no=bl.customer_id
    AND ac.account_id=pc.account_id
    AND cbar.active=1
    AND bo.s_org_id= :account_id ) a left join table_contact_role@bill_to_crm cr ON a.objid=cr.contact_role2bus_org
    left join table_contact@bill_to_crm c ON cr.contact_role2contact=c.objid
  ) WHERE rn=1
  `;

  // return `
  // SELECT * FROM (
  //   SELECT a."Account ID",
  //   '0'||a."Account ID"||check_digit(a."Account ID"*1) "10 digit Account ID",
  //    a."Account Name", a."Customer Type", a."Bill Frequency", a."CCInfo" "CCInfo#", a."Payment Type" "PayMethod#", a."Bill Cycle Code", a."Account Status",
  //   c.x_id "IC Number",
  //   c.x_id_type "IC Type",
  //   NVL((select NVL(STATUS_CODE,'NO') from (select row_number() over(partition by entity_id order by pa_id desc) RN , status_code
  //   from  CL1_PA a where ENTITY_ID=:account_id) AA where RN=1),'NO') "PTPViolated#",
  //   case when max(trunc(due_date - sysdate)) over(partition by 'Account ID') < 0 then 0 else max(trunc(due_date - sysdate)) over(partition by 'Account ID') end  "DebtAge",
  //        case when max(trunc(due_date) - trunc(sysdate+30)) over(partition by 'Account ID') < 0 then 0 else max(trunc(due_date - trunc(sysdate+30))) over(partition by 'Account ID') end "InvDebtAge",
  //   CASE WHEN c.x_vip_indicator=1 THEN
  //   NVL(CASE WHEN UPPER(trim((SELECT title FROM table_hgbst_elm@bill_to_crm WHERE objid=c.x_vip_cat2hgbst_elm AND ROWNUM=1))) = 'PLEASE SPECIFY' THEN NULL ELSE(SELECT title FROM table_hgbst_elm@bill_to_crm WHERE objid=c.x_vip_cat2hgbst_elm AND ROWNUM=1) END, (SELECT title FROM table_hgbst_elm@bill_to_crm WHERE s_title = 'VIP' AND ROWNUM=1))
  //   ELSE (SELECT title FROM table_hgbst_elm@bill_to_crm WHERE s_title = 'NON-VIP' AND ROWNUM=1) END "VIP Status",
  //   row_number() over(PARTITION BY a.objid ORDER BY cr.s_role_name DESC, cr.contact_role2contact DESC) rn
  //   FROM (
  //   SELECT
  //   DISTINCT ac.account_id  "Account ID", --'0'||ac.account_id||'-'||check_digit(ac.account_id*1) "10 digit Account ID",
  //   bo.name "Account Name",
  //   bo.x_blg_cust_type "Customer Type",
  //   ba.x_charge_freq "Bill Frequency",
  //   (SELECT    a.extract_date || ' - ' || gc.description
  //   FROM ar1_direct_debit_request a, ar1_generic_codes gc
  //   WHERE a.account_id = ac.account_id
  //   AND extract_date = (SELECT MAX (extract_date) FROM ar1_direct_debit_request x WHERE x.account_id = a.account_id)
  //   AND gc.code(+) = a.request_status AND ROWNUM=1)  "Last CC/DD Extraction",
  //   CASE WHEN pc.payment_method = 'CC' THEN 'Bank Name: ' || pm.Bank_Name || ' ' || RTRIM(pc.payment_method) || ' Type: ' || CASE WHEN pc.CREDIT_CARD_TYPE = 'M' THEN 'MasterCard' ELSE 'Visa' END  || ' Exp MM YYYY: ' || pc.CC_EXPIRY_DATE || ' Last Four: ' || substr (pc.CREDIT_CARD_NUMBER,13,4) ELSE '' END "CCInfo",
  //   CASE WHEN pc.payment_method = 'SL' THEN 'Salary Deduction' ELSE (SELECT gc.description FROM ar1_generic_codes gc WHERE TYPE='PAYMENT_METHOD' AND code=trim(pc.payment_method)) END "Payment Type", ac.ar_balance "AR Balance",
  //   CASE WHEN (SELECT COUNT (0) FROM subscriber s WHERE s.customer_id = ac.customer_no AND sub_status = 'A') > 0 THEN 'A'
  //   ELSE 'S' END "Account Status",
  //   bl.cycle_code "Bill Cycle Code", new_cycle "New Bill Cycle Code",
  //   TO_CHAR (bl.old_cycle_exp_date, 'dd-Mon-yyyy') "Old Bill Cycle Exp Date",
  //   ba.bar_id, bo.objid, cg.due_date       FROM
  //   table_bus_org@bill_to_crm bo,
  //   table_con_blg_argmnt_role@bill_to_crm cbar,
  //   table_blg_argmnt@bill_to_crm ba,
  //   table_pay_means@bill_to_crm pm,
  //   ar1_account ac, bl1_customer bl, ar1_pay_channel pc, ar1_charge_group cg
  //   WHERE       bo.objid=cbar.ba_account2bus_org
  //   AND cbar.ba_role2blg_argmnt=ba.objid
  //   AND bo.org_id=ac.account_id
  //   AND ac.customer_no=bl.customer_id
  //   AND ac.account_id=pc.account_id
  //   and ac.account_id=cg.account_id
  //   AND cbar.active=1
  //   AND pm.objid = ba.blg_argmnt2pay_means
  //   AND bo.s_org_id=:account_id
  //   ) a left join table_contact_role@bill_to_crm cr ON a.objid=cr.contact_role2bus_org
  //   left join table_contact@bill_to_crm c ON cr.contact_role2contact=c.objid
  //   ) WHERE rn=1
  // `;
};
// CRM DB
exports.accountDetailsDCAQuery = () => {
  return `
    SELECT bo.s_org_id "Account ID",tc.first_name "ContactName",  tc.X_ID "IC No",
    tc.X_ID_TYPE "Type",       tc.mobile_phone "MobilePhone",      tc.x_home_phone "HomePhone",
    tc.x_office_phone "OfficePhone",       tc.e_mail "Email", blg_cust_sub_type "Type#", blg_cust_type "Sub Type#", 
    (SELECT title FROM table_hgbst_elm WHERE objid=tc.x_race2hgbst_elm AND ROWNUM = 1) "Race"
    FROM table_bus_org bo, table_contact_role cr, table_contact tc
    WHERE bo.objid=cr.contact_role2bus_org AND tc.objid=cr.contact_role2contact
    AND bo.s_org_id=:account_id   ORDER BY s_role_name DESC
  `;
};
exports.accountDetailsWinleadQuery = () => {
  return `
    SELECT bo.s_org_id "Account ID",tc.first_name "ContactName",  tc.X_ID "IC No",
    tc.X_ID_TYPE "Type",       tc.mobile_phone "MobilePhone",      tc.x_home_phone "HomePhone",
    tc.x_office_phone "OfficePhone",       tc.e_mail "Email", blg_cust_sub_type "Type#", blg_cust_type "Sub Type#", 
    (SELECT title FROM table_hgbst_elm WHERE objid=tc.x_race2hgbst_elm AND ROWNUM = 1) "Race"
    FROM table_bus_org bo, table_contact_role cr, table_contact tc
    WHERE bo.objid=cr.contact_role2bus_org AND tc.objid=cr.contact_role2contact
    AND bo.s_org_id=:account_id   ORDER BY s_role_name DESC
  `;
};
// RNL db
exports.winleadAccountSearchSummaryQuery = () => {
  const query = `select a.debtage debtage, a.invdebtage invdebtage, a.credit_class creditclass from (
    select a.*, row_number () OVER (PARTITION BY account_id ORDER BY a.debtage desc) rnk from (
    select a.account_id , invoice_id ,charges_amount,creation_date,due_date,
     case when CREDIT_CLASS in ('IPTV','HI') and BALANCE<=10 then 0
     when CREDIT_CLASS in ('ME','LO') and balance <=20 then 0
     else balance end Balance, credit_class,balance bal, 
     Case when trunc(sysdate-due_date) < 0 then 0 else trunc(sysdate-due_date) end debtage,
     trunc(sysdate-(due_date - 30))  invdebtage
     from (select account_id,INVOICE_ID,sum(CHARGES_AMOUnt) charges_amount, sum(balance) balance, CREATION_DATE,due_date
     from (select * from AR1_CHARGE_GROUP where account_id=:account_id and balance>0) a
     where account_id=:account_id
     group by account_id,INVOICE_ID, CREATION_DATE,due_date ) a,
     AR1_ACCOUNT ac,
     CUSTOMER b
     where balance > 0
     and a.account_id=:account_id
     and ac.ACCOUNT_ID=a.ACCOUNT_ID
     and b.CUSTOMER_ID=ac.CUSTOMER_NO) a
     where a.balance > 0) a where a.rnk=1`;
  return query;
};
// RNL db
exports.lastPaymentDetailsQuery = () => {
  const query = `select * from (select AMOUNT LastPaymentAmount, Deposit_Date LastPaymentDate from AR1_PAYMENT_DETAILS
    where ACCOUNT_ID=:account_id order by ar1_payment_details.deposit_date desc) a where LastPaymentAmount>0 and rownum <2`;
  return query;
};
// RNL db
exports.AccountBillStatusCollectionStateQuery = () => {
  const query = `select account_id, COLLECTION_INDICATOR "Collection Status",
  case when a.L9_BILL_MEDIA = 'E' then 'E-Bill'
                            when a.L9_BILL_MEDIA = 'P' then 'Paper-Bill'
                                    when a.L9_BILL_MEDIA = 'W' then 'Web-Bill'
                                    when a.L9_BILL_MEDIA = 'S' then 'SMS-Bill' 
            when a.L9_BILL_MEDIA = 'N' then 'N-Bill'  end Bill_Type from ar1_account ac join CUSTOMER a on ac.customer_NO = a.customer_id 
            where account_id=:account_id
`;
  return query;
};
