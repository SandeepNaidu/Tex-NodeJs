const searchCriteria = {
  smc_no: 'Smart Card',
  invoice_no: 'Invoice Number',
  ic_value: 'IC Number',
  account_no: 'Account Number',
  email_id: 'Email Address',
  contact_no: 'Mobile Number'
};

const leadSearchCriteria = {
  lead_id: 'Lead ID',
  lead_name: 'Lead Name',
  lead_mobile_no: 'Lead Mobile Number',
  lead_home_no: 'Lead Home Number',
  lead_office_no: 'Lead Office Number',
  lead_order_id: 'Lead Order ID'
};

// RNL DB
const subscriptionInfoQuery = () => {
  const query = `SELECT ac.account_id,
    s.subscriber_no,
    s.prim_resource_val smartcardnumber ,
    TO_CHAR(sp.install_date,'dd-Mon-yyyy') activationdate,
    sp.part_status subscriptionstatus,
    REPLACE(TO_CHAR(sub_status_date,'dd-Mon-yyyy hh:mi:ss AM'),'12:00:00 AM','') statusdate,
    sp.x_campaign_code campaigncode,
    (SELECT RTRIM( xmlagg (xmlelement (c,  description||' - Effective Date : '||effective_date|| ',')
    ORDER BY description||' - Effective Date : '||effective_date).extract ('//text()'), ',' )  pkg
    FROM bl1_rc_rates rc,bl1_charge_code c
    WHERE service_receiver_id= s.subscriber_no
    AND receiver_customer=s.customer_id
    AND c.charge_code=rc.charge_code
    AND NVL(expiration_date,SYSDATE+1)>SYSDATE) packages
    FROM ar1_account ac, subscriber s, table_site_part@bill_to_crm sp
    WHERE ac.account_id=:account_id
    AND s.customer_id=ac.customer_no
    AND sp.s_instance_id=TO_CHAR(s.subscriber_no)
    ORDER BY statusdate asc, sp.part_status DESC, sp.install_date DESC, s.prim_resource_val ASC`;
  return query;
};

// CRM DB
const contactInfoQuery = () => {
  const query = `SELECT
  tc.first_name "ContactName",
  tc.phone "PrimaryPhone",
  tc.x_home_phone "HomePhone",
  tc.mobile_phone "MobilePhone",
  tc.x_office_phone "OfficePhone",
  tc.fax_number "Fax",
  tc.e_mail "Email",
  (SELECT title FROM table_hgbst_elm WHERE objid=tc.x_race2hgbst_elm AND ROWNUM=1) "Race",
  TO_CHAR(tc.birth_date,'dd-Mon-yyyy') "DOB",
  (SELECT title FROM table_hgbst_elm WHERE objid=tc.x_ntnlty2hgbst_elm AND ROWNUM=1) "Nationality",
  CASE WHEN tc.x_vip_indicator=1 THEN
  NVL(CASE WHEN UPPER(trim((SELECT title FROM table_hgbst_elm WHERE objid=tc.x_vip_cat2hgbst_elm AND ROWNUM=1))) = 'PLEASE SPECIFY' THEN NULL ELSE(SELECT title FROM table_hgbst_elm      WHERE objid=tc.x_vip_cat2hgbst_elm AND ROWNUM=1) END, (SELECT title FROM table_hgbst_elm WHERE s_title = 'VIP' AND ROWNUM=1))
  ELSE (SELECT title FROM table_hgbst_elm WHERE s_title = 'NON-VIP' AND ROWNUM=1) END "VIPStatus"
  FROM
  table_bus_org bo,
  table_contact_role cr,
  table_contact tc
  WHERE bo.objid=cr.contact_role2bus_org
  AND tc.objid=cr.contact_role2contact
  AND bo.s_org_id=:account_id
  ORDER BY s_role_name DESC`;
  return query;
};

// Query to get primary number for D+H
const getPrimaryNumberQuery = () => {
  const query = `SELECT
  tc.phone "PrimaryPhone"
  FROM
  table_bus_org bo,
  table_contact_role cr,
  table_contact tc
  WHERE bo.objid=cr.contact_role2bus_org
  AND tc.objid=cr.contact_role2contact
  AND bo.s_org_id=:account_id
  ORDER BY s_role_name DESC`;
  return query;
};

// RNL DB
const accountInfoQuery = () => {
  const query = `SELECT * FROM (
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
  return query;
};

// RNL DB
const getStatusForPriceCalculator = () => {
  const query = `SELECT 
  SUB_STATUS FROM SUBSCRIBER WHERE prim_resource_val=:smc_no`;
  return query;
};
// OMS DB
const activeSmcPriceCalculator = () => {
  const query = `SELECT CID, service_type, description FROM
  (SELECT
  t2.status,
  t2.service_type,
  t1.service_id smcno,
  t2.start_date,
  t2.end_date,
  t2.item_def_id,
  t2.ap_id,
  t2.ap_version_id,
  TO_CHAR(cid.name_text) description,
  cid.cid, cid.PCVERSION_ID,
  row_number() over (PARTITION BY t2.item_def_id ORDER BY t2.start_date DESC, TO_NUMBER(t2.ap_version_id) DESC, cid.PCVERSION_ID DESC) rn2
  FROM
  (
  SELECT a.ap_id, a.service_id FROM
  (
  SELECT
  ap_id, service_id, row_number() over (PARTITION BY service_type ORDER BY start_date DESC) rn
  FROM tbap_item WHERE service_id=:smc_no AND main_ind='1' AND state = 'AS' AND status='AC'
  ) a WHERE rn=1
  ) t1
  INNER JOIN tbap_item t2 ON (t1.ap_id = t2.main_item_id AND t2.state='AS' AND t2.status='AC')
  LEFT OUTER JOIN tbname cid ON (cid.cid = t2.item_def_id AND cid.LANGUAGE='EN')
  WHERE
  t2.end_date >= SYSDATE
  AND t2.start_date <= SYSDATE
  AND NOT cid.name_text LIKE 'Discount%'
  AND NOT cid.name_text LIKE 'PDL%'
  AND NOT cid.name_Text LIKE 'Security%'
  AND NOT cid.name_text LIKE 'Pairing%'
  AND t2.item_def_id NOT IN (15141)
  AND ((t2.service_type IS NULL
  AND NOT cid.name_text LIKE 'Recording%'
  AND NOT cid.name_text LIKE '%Discount%'
  AND NOT cid.name_text LIKE '%for Residential'
  AND NOT cid.name_text LIKE 'ABO%'
  AND NOT cid.name_text LIKE 'Basic%'
  AND NOT cid.name_text LIKE 'ASTEGP'
  AND NOT cid.name_text LIKE 'Channel%'
  AND NOT cid.name_text LIKE 'HD Service Fee%'
  AND NOT cid.name_text LIKE 'AOD%'
  AND NOT cid.name_text LIKE 'OC %')
  OR t2.service_type NOT IN ('GRP','SMC', 'INT', 'STB', 'TVMC', 'COMM', 'INST'))
  ) b
  WHERE rn2=1
  UNION ALL
      select null service_type, cid, TO_CHAR(b.name_text)
      From tbap_price_plan a LEFT JOIN tbname b ON a.item_def_id=b.cid
      and a.item_def_ver=b.pcversion_id and b.Language='EN'
      where main_item_id
      IN (SELECT a.ap_id FROM
      (
      SELECT
      ap_id, item_def_id , service_id, row_number() over (PARTITION BY service_type ORDER BY start_date DESC) rn
      FROM tbap_item WHERE service_id=:smc_no AND main_ind='1' AND state = 'AS' AND status='AC'
      ) a WHERE rn=1)
      and a.end_date >= SYSDATE AND a.start_date <= SYSDATE
      AND NOT b.name_text LIKE 'Discount%'
      AND NOT b.name_text LIKE '%for Res'
      ORDER BY service_type DESC`;
  return query;
};
// OMS DB
const suspendedSmcPriceCalculator = () => {
  const query = `SELECT CID, service_type, description FROM
  (SELECT
  t2.status,
  t2.service_type,
  t1.service_id smcno,
  t2.start_date,
  t2.end_date,
  t2.item_def_id,
  t2.ap_id,
  t2.ap_version_id,
  TO_CHAR(cid.name_text) description,
  cid.cid, cid.PCVERSION_ID,
  row_number() over (PARTITION BY t2.item_def_id ORDER BY t2.start_date DESC, TO_NUMBER(t2.ap_version_id) DESC, cid.PCVERSION_ID DESC) rn2
  FROM
  (
  SELECT a.ap_id, a.service_id FROM
  (
  SELECT
  ap_id, service_id, row_number() over (PARTITION BY service_type ORDER BY start_date DESC) rn
  FROM tbap_item WHERE service_id=:smc_no AND main_ind='1' AND state = 'AS' AND status='SU'
  ) a WHERE rn=1
  ) t1
  INNER JOIN tbap_item t2 ON (t1.ap_id = t2.main_item_id AND t2.state='AS' AND t2.status='SU')
  LEFT OUTER JOIN tbname cid ON (cid.cid = t2.item_def_id AND cid.LANGUAGE='EN')
  WHERE
  t2.end_date >= SYSDATE 
 AND t2.start_date <= SYSDATE
  AND NOT cid.name_text LIKE 'Discount%'
  AND NOT cid.name_text LIKE 'PDL%'
  AND NOT cid.name_Text LIKE 'Security%'
  AND NOT cid.name_text LIKE 'Pairing%'
  AND t2.item_def_id NOT IN (15141)
  AND ((t2.service_type IS NULL
  AND NOT cid.name_text LIKE 'Recording%'
  AND NOT cid.name_text LIKE '%Discount%'
  AND NOT cid.name_text LIKE '%for Residential'
  AND NOT cid.name_text LIKE 'ABO%'
  AND NOT cid.name_text LIKE 'Basic%'
  AND NOT cid.name_text LIKE 'ASTEGP'
  AND NOT cid.name_text LIKE 'Channel%'
  AND NOT cid.name_text LIKE 'HD Service Fee%'
  AND NOT cid.name_text LIKE 'AOD%'
  AND NOT cid.name_text LIKE 'OC %')
  OR t2.service_type NOT IN ('GRP','SMC', 'INT', 'STB', 'TVMC', 'COMM', 'INST'))
  ) b
  WHERE rn2=1
  ORDER BY service_type DESC`;
  return query;
};
// RNL DB
const getCustomerIdPriceCalculator = (smcNo) => {
  const query = `select customer_id from subscriber s where s.prim_resource_val='${smcNo}'`;
  return query;
};
// RNL DB
const searchBySMC = () => {
  const query = `SELECT DISTINCT a.account_id "accID", s.sub_status, s.init_act_date
  FROM subscriber s, ar1_account a
  WHERE s.customer_id=a.customer_no AND s.prim_resource_val=:search_value
  ORDER BY s.sub_status ASC, s.init_act_date DESC`;
  return query;
};

// RNL DB
const searchByInvoiceNo = () => {
  const query =
    'SELECT account_id "accID" From ar1_invoice where billing_invoice_number=:search_value';
  return query;
};

// CRM DB
const searchByIC = () => {
  const query = `SELECT DISTINCT bo.s_org_id FROM
    table_bus_org bo,
    table_contact_role cr,
    table_contact tc
    WHERE bo.objid=cr.contact_role2bus_org
    AND tc.objid=cr.contact_role2contact
    AND tc.x_id=:search_value
    AND bo.s_org_id NOT LIKE '%AN_CUST'
    ORDER BY bo.s_org_id DESC`;
  return query;
};

// CRM DB
const searchByAccountNo = () => {
  const query = `SELECT
     tc.first_name "ContactName",
     tc.phone "PrimaryPhone",
     tc.x_home_phone "HomePhone",
     tc.mobile_phone "MobilePhone",
     tc.x_office_phone "OfficePhone",
     tc.fax_number "Fax",
     tc.e_mail "Email",
     (SELECT title FROM table_hgbst_elm WHERE objid=tc.x_race2hgbst_elm AND ROWNUM = 1) "Race",
     TO_CHAR(tc.birth_date,'dd-Mon-yyyy') "DOB",
     (SELECT title FROM table_hgbst_elm WHERE objid=tc.x_ntnlty2hgbst_elm AND ROWNUM = 1) "Nationality",
     CASE WHEN tc.x_vip_indicator = 1 THEN
     NVL(CASE WHEN UPPER(trim((SELECT title FROM table_hgbst_elm WHERE objid=tc.x_vip_cat2hgbst_elm AND ROWNUM = 1))) = 'PLEASE SPECIFY' THEN NULL ELSE(SELECT title FROM table_hgbst_elm WHERE objid=tc.x_vip_cat2hgbst_elm AND ROWNUM = 1) END,
      (SELECT title FROM table_hgbst_elm WHERE s_title = 'VIP' AND ROWNUM = 1))
     ELSE (SELECT title FROM table_hgbst_elm WHERE s_title = 'NON-VIP' AND ROWNUM = 1) END "VIPStatus"
     FROM
     table_bus_org bo,
     table_contact_role cr,
     table_contact tc
     WHERE bo.objid=cr.contact_role2bus_org
     AND tc.objid=cr.contact_role2contact
     AND bo.s_org_id=:search_value
     ORDER BY s_role_name DESC`;
  return query;
};

const DCAaddressInfoQuery = () => {
  const query = `SELECT 'Mailing Address' "AddressType",  a.x_mailing_label1 "Address1",
  a.x_mailing_label2 "Address2",
  a.x_mailing_label3 "Address3",
  a.x_mailing_label4 "Address4",
  a.x_mailing_label5 "Address5",
  (SELECT name  FROM table_state_prov WHERE a.address2state_prov = objid) "State",
  a.s_city "City",
  a.s_zipcode "Zip"
  FROM table_bus_org bo, table_address a
  WHERE bo.x_bus_org2mail_addr = a.objid
  AND bo.s_org_id =:account_id
  UNION
  SELECT 'Service Address' "AddressType",  a.x_mailing_label1 "Address1",
  a.x_mailing_label2 "Address2",
  a.x_mailing_label3 "Address3",
  a.x_mailing_label4 "Address4",
  a.x_mailing_label5 "Address5",
  (SELECT name  FROM table_state_prov WHERE a.address2state_prov = objid) "State",
  a.s_city "City",
  a.s_zipcode "Zip"
  FROM  table_address a,
  table_state_prov state,
  (SELECT * FROM (
  SELECT
  s_role_name,
  s.objid AS site_objid,
  cr.contact_role2contact AS contact_objid,
  s.primary2bus_org AS bus_org_objid,
  s.cust_primaddr2address,s_org_id,
  row_number() over(PARTITION BY primary2bus_org ORDER BY s_role_name DESC,contact_role2contact DESC) rn
  FROM
  table_bus_org tbo,
  table_site s,
  table_contact_role cr WHERE
  tbo.s_org_id=:account_id
  AND s.primary2bus_org=tbo.objid
  AND s.objid = cr.contact_role2site) a WHERE rn = 1) cs
  WHERE
  a.objid = cs.cust_primaddr2address
  AND a.address2state_prov = state.objid
  UNION
  SELECT 'Billing Address' "AddressType",  a.x_mailing_label1 "Address1",
  a.x_mailing_label2 "Address2",
  a.x_mailing_label3 "Address3",
  a.x_mailing_label4 "Address4",
  a.x_mailing_label5 "Address5",
  (SELECT name  FROM table_state_prov WHERE a.address2state_prov = objid) "State",
  a.s_city "City",
  a.s_zipcode "Zip"
  FROM table_bus_org bo, table_con_blg_argmnt_role cba, table_blg_argmnt  ba, table_address a
  WHERE bo.objid=cba.ba_account2bus_org
  AND ba.objid=cba.ba_role2blg_argmnt
  AND cba.addr_src_lowid=a.objid
  AND cba.active = 1
  AND bo.s_org_id=:account_id`;
  return query;
};

const addressInfoQuery = () => {
  const query = `SELECT 'Mailing Address' "AddressType",  a.x_mailing_label1 "Address1",
  a.x_mailing_label2 "Address2",
  a.x_mailing_label3 "Address3",
  a.x_mailing_label4 "Address4",
  a.x_mailing_label5 "Address5",
  (SELECT name  FROM table_state_prov WHERE a.address2state_prov = objid) "State",
  a.s_city "City",
  a.s_zipcode "Zip"
  FROM table_bus_org bo, table_address a
  WHERE bo.x_bus_org2mail_addr = a.objid
  AND bo.s_org_id =:account_id
  UNION
  SELECT 'Service Address' "AddressType",  a.x_mailing_label1 "Address1",
  a.x_mailing_label2 "Address2",
  a.x_mailing_label3 "Address3",
  a.x_mailing_label4 "Address4",
  a.x_mailing_label5 "Address5",
  (SELECT name  FROM table_state_prov WHERE a.address2state_prov = objid) "State",
  a.s_city "City",
  a.s_zipcode "Zip"
  FROM  table_address a,
  table_state_prov state,
  (SELECT * FROM (
  SELECT
  s_role_name,
  s.objid AS site_objid,
  cr.contact_role2contact AS contact_objid,
  s.primary2bus_org AS bus_org_objid,
  s.cust_primaddr2address,s_org_id,
  row_number() over(PARTITION BY primary2bus_org ORDER BY s_role_name DESC,contact_role2contact DESC) rn
  FROM
  table_bus_org tbo,
  table_site s,
  table_contact_role cr WHERE
  tbo.s_org_id=:account_id
  AND s.primary2bus_org=tbo.objid
  AND s.objid = cr.contact_role2site) a WHERE rn = 1) cs
  WHERE
  a.objid = cs.cust_primaddr2address
  AND a.address2state_prov = state.objid
  UNION
  SELECT 'Billing Address' "AddressType",  a.x_mailing_label1 "Address1",
  a.x_mailing_label2 "Address2",
  a.x_mailing_label3 "Address3",
  a.x_mailing_label4 "Address4",
  a.x_mailing_label5 "Address5",
  (SELECT name  FROM table_state_prov WHERE a.address2state_prov = objid) "State",
  a.s_city "City",
  a.s_zipcode "Zip"
  FROM table_bus_org bo, table_con_blg_argmnt_role cba, table_blg_argmnt  ba, table_address a
  WHERE bo.objid=cba.ba_account2bus_org
  AND ba.objid=cba.ba_role2blg_argmnt
  AND cba.addr_src_lowid=a.objid
  AND cba.active = 1
  AND bo.s_org_id=:account_id`;
  return query;
};

// CRM DB
const interactionInfoQuery = () => {
  const query = `SELECT
  TO_CHAR(a.start_time,'dd-Mon-yyyy hh12:mi:ss AM') "Start Time",
  TO_CHAR(a.end_time,'dd-Mon-yyyy hh12:mi:ss AM') "End Time",
  a.title "Title",   notes "Notes",
  d.s_login_name "Login Name",
  e.first_name "First Name",
  e.last_name "Last Name"
  FROM table_intrxn a, table_bus_org b,table_session c,table_user d, table_employee e
  WHERE a.intrxn2bus_org = b.objid
  AND b.s_org_id = :account_id
  AND c.session2intrxn=a.objid
  AND  c.session2user=d.objid(+)
  AND e.employee2user(+)=d.objid
  ORDER BY a.start_time DESC`;
  return query;
};

// CRM DB
const caseInfoQuery = () => {
  const query = `SELECT 
  id_number,
  title "Title",
  TO_CHAR(creation_time,
  'dd-Mon-yyyy hh:mi:ss AM') creation_time,
  x.x_case_type Type,
  (SELECT title FROM table_gbst_elm a WHERE a.objid=respprty2gbst_elm and rownum=1) prio,
  (SELECT COUNT(0) FROM table_subcase a WHERE a.subcase2case=x.objid) subcase,
  case_type_lvl2 ,
  case_type_lvl3,
  (SELECT title FROM table_gbst_elm a WHERE a.objid=casests2gbst_elm and rownum=1) status 
  FROM table_case x,table_site ts, table_bus_org tbo
  WHERE case_reporter2site = ts.objid AND tbo.objid = ts.primary2bus_org
  AND tbo.s_org_id = :account_id ORDER BY 1 DESC`;
  return query;
};

// RNL DB
const billingInfoQuery = () => {
  const query = `SELECT customer_no "custID", ba.billing_arrangement_id "blarrange"
  FROM ar1_account ac, ar1_billing_arrangement ba
  WHERE ba.account_id=ac.account_id AND ac.account_id=:account_id`;
  return query;
};

// RNL DB
const billingSummaryQuery = () => {
  const query = `SELECT * FROM
  ( SELECT
  TO_CHAR(b.statement_date,'dd-Mon-yyyy') "Last Statement Date",
  b.prev_balance_amt+b.total_finance_act "Remaining Unpaid Balance",
  TO_CHAR(b.due_date,'dd-Mon-yyyy') "New Charges Due Date",
  b.total_amt_due "Total Amount Due", b.period_key "Period Key", b.state_seq_no "State Seq No",
  row_number() over(PARTITION BY b.ba_no ORDER BY b.sys_creation_date DESC) rn2
  FROM bl1_bill_statement b
  WHERE b.ba_no= :blarrange) d WHERE d.rn2=1`;
  return query;
};

// CRM DB
const pdpaInfoQuery = () => {
  const query = `SELECT
  CASE WHEN tc.x_direct_mail_optout = 1 THEN 'YES' ELSE 'NO' END direct_mail,
  CASE WHEN tc.x_sms_optout = 1 THEN 'YES' ELSE 'NO' END sms,
  CASE WHEN tc.x_ivr_optout = 1 THEN 'YES' ELSE 'NO' END ivr,
  CASE WHEN tc.x_email_optout = 1 THEN 'YES' ELSE 'NO' END email,
  CASE WHEN tc.x_other_optout = 1 THEN 'YES' ELSE 'NO' END other,
  CASE WHEN tc.x_website_optout = 1 THEN 'YES' ELSE 'NO' END website
  FROM
  table_bus_org bo,
  table_contact_role cr,
  table_contact tc
  WHERE bo.objid=cr.contact_role2bus_org
  AND tc.objid=cr.contact_role2contact
  AND bo.s_org_id=:account_id
  ORDER BY s_role_name DESC`;
  return query;
};

// CRM DB
const caseHistoryInfoQuery = () => {
  const query = `SELECT (SELECT title FROM table_gbst_elm WHERE rank=act_code AND ROWNUM=1) "Activity", TO_CHAR(entry_time,'dd-Mon-yyyy hh:mi:ss AM') "CreationTime", Entry_time,
                (SELECT s_login_name FROM table_user x WHERE x.objid=act_entry2user) "LoginName", addnl_info "AdditionalInformation",
                (SELECT description FROM table_notes_log WHERE objid=act_entry2notes_log) "Notes", (SELECT TO_CHAR(NOTES) FROM table_phone_log WHERE objid=act_entry2phone_log) "PhoneLogs"
                FROM table_act_entry a WHERE act_entry2case=(SELECT objid FROM table_case WHERE id_number = :case_id) ORDER BY Entry_time DESC`;
  return query;
};

// OMS DB
const caseFulfillmentOrderInfoQuery = () => {
  const query = `SELECT order_id,
                (SELECT CAPTION FROM tbdecode WHERE LANGUAGE_ID='EN' AND OWNERSHIP='OMS' AND UPPER(DECODE_ID) LIKE UPPER('OrderActionStatus%' || status)) order_status
                FROM tborder_action WHERE order_unit_id=:case_id`;

  // Old Query
  // const query = `SELECT order_id,
  //               (SELECT CAPTION FROM tbdecode WHERE LANGUAGE_ID='EN' AND OWNERSHIP='OMS' AND UPPER(DECODE_ID) LIKE UPPER('OrderActionStatus%' || status)) order_status
  //               FROM tborder_action WHERE order_unit_id='${params.case_id}'`;
  return query;
};

// CRM DB
const caseFulfillmentDetailsInfoQuery = () => {
  const query = `SELECT * FROM (SELECT
                  NVL(S_X_SC_SER_NO, '-') "SmartCardNo",
                  NVL(S_X_DMT_SER_NO, '-') "DMTSerialNo",
                  NVL(r.S_X_INSTALLER_CODE, '-') "InstallerCode",
                  NVL(i.s_x_name, '-') "InstallerName",
                  NVL(i.s_x_installer_region, '-') "InstallerRegion",
                  NVL(S_X_RQST_STATUS, '-') "FullFillmentStatus"
                  FROM table_x_fulfill_rqst r left join table_x_installer i ON r.s_x_installer_code=i.s_x_installer_code
                  WHERE s_x_case_id = :case_id
                  ORDER BY r.objid DESC) a
                  WHERE ROWNUM=1`;
  return query;
};

// CRM DB
const caseFlexibleAttributesInfoQuery = () => {
  const query =
    'SELECT attribute_name, s_attribute_value FROM table_fa_case a WHERE fa_Case2case = :case_obj_id';
  return query;
};

const caseDetailsInfoQuery = () => {
  // New Query
  const query = `SELECT id_number "Case ID",
                title "Case Title",
                TO_CHAR(creation_time,'dd-Mon-yyyy hh:mi:ss AM') "Creation Time",
                x.x_case_type "Type",
                (SELECT title FROM table_gbst_elm a WHERE a.objid=respprty2gbst_elm and rownum=1) "Priority",
                (SELECT title FROM table_gbst_elm a WHERE a.objid=respsvrty2gbst_elm and rownum=1) "Severity",
                (SELECT COUNT(0) FROM table_subcase a WHERE a.subcase2case=x.objid) "Subcase",
                x_pref_call_time "Prefered Call Time",
                (CASE WHEN x_recurr_issue=1 THEN 'Yes' ELSE 'No' END) "Recurring Issue",
                case_type_lvl1 "Case Type Lvl1",case_type_lvl2 "Case Type Lvl2",case_type_lvl3 "Case Type Lvl3",
                case_history "Case History",
                (SELECT title FROM table_condition WHERE objid=case_state2condition) "Case Condition",
                (SELECT s_login_name FROM table_user x WHERE x.objid=case_owner2user) "Case Owner",
                (SELECT s_login_name FROM table_user x WHERE x.objid=case_originator2user) "Case Orignator",
                (SELECT title FROM table_gbst_elm a WHERE a.objid=casests2gbst_elm and rownum=1) "Status",
                Objid as CaseObjId,
                x_fulfillment_order_id as FulfillmentOrderId
                FROM table_case x WHERE id_number=:case_id`;

  // Old Query

  // const query = `SELECT
  //               id_number "SubCase ID", title,
  //               TO_CHAR(creation_time,'dd-Mon-yyyy hh:mi:ss AM') "Creation Time",
  //               description "SubCase Description", sub_type "Type",
  //               (SELECT s_login_name FROM table_user x WHERE x.objid=subc_owner2user) "Owner",
  //               (SELECT title FROM table_condition WHERE objid=subc_state2condition) "Condition",
  //               (SELECT s_login_name FROM table_user x WHERE x.objid=subc_orig2user) "Orginator",
  //               (SELECT title FROM table_gbst_elm a WHERE a.objid=subc_priorty2gbst_elm and rownum=1) "Priority",
  //               (SELECT title FROM table_gbst_elm a WHERE a.objid=subc_svrity2gbst_elm and rownum=1) "Severity",
  //               (SELECT title FROM table_gbst_elm a WHERE a.objid=subc_casests2gbst_elm and rownum=1) "Status"
  //               FROM  table_subcase WHERE id_number LIKE '${params.case_id}'`;
  return query;
};

const caseInfoSubCaseQuery = () => {
  const query = `SELECT id_number,
                (SELECT title FROM table_condition WHERE objid=subc_state2condition and rownum=1) cond,
                (SELECT title FROM table_gbst_elm a WHERE a.objid=subc_casests2gbst_elm and rownum=1) sts,
                (SELECT s_login_name FROM table_user x WHERE x.objid=subc_owner2user) owner, TO_CHAR(creation_time,'dd-Mon-yyyy hh:mi:ss AM')creation_time, Title
                FROM  table_subcase WHERE id_number like :case_id`;
  return query;
};

// Query to get smartcard numbers to fetch AP ID's - RNL DB
const getSmartCardNumbers = (params) => {
  const query = `SELECT distinct s.prim_resource_val as smartcardnumber
                FROM ar1_account ac, subscriber s
                WHERE ac.account_id=:account_id
                AND s.customer_id=ac.customer_no`;
  return query;
};

// Query to get AP ID's from smart card numbers - OMS DB
const getApIdFromSmartCardNumber = () => {
  const query = `select distinct ap_id
                from tbap_item
                where service_id in (:smcNumbers)`;
  return query;
};

// Lead Module Queries

const leadOverviewQuery = (params) => {
  const query = `SELECT OBJID, 
                X_LEAD2BILLING_ADDR, 
                X_LEAD2SERVICE_ADDR, 
                X_PROSPECT_ID, 
                SALUTATION "Salutation", 
                S_FIRST_NAME "Name", 
                (SELECT TITLE FROM table_hgbst_elm a where a.objid=X_ID_TYPE2HGBST_ELM) "ID Type",
                X_ID "ID No.",
                COMPANY_NAME "Account Name", 
                X_COMPANY_NAME "Company Name", 
                X_CAMP_INFO "Campaign Info", 
                SITE_NAME "Site Name", 
                ADDRESS "Address", 
                ADDRESS_2 "Address 2", 
                CITY "City", 
                STATE "State", 
                POSTAL_CODE "PostCode", 
                COUNTRY "Country", 
                TIME_ZONE "Time Zone", 
                S_PHONE "Phone No.",
                (SELECT NAME FROM TABLE_LEAD_STAGE WHERE OBJID=LEAD2LEAD_STAGE) "Lead Stage",
                RATING "Rating",
                (SELECT s_attribute_value From table_fa_lead fl where attribute_name='x_home_phone' and fa_lead2lead=l.objid) "Home Phone No.", 
                MOBILE_PHONE "Mobile No.",
                E_MAIL "Email",
                FAX "Fax",
                TITLE "Job Title",
                CASE WHEN STATUS=1 THEN 'Active' ELSE 'Inactive' END "Status", 
                (SELECT S_LOGIN_NAME FROM TABLE_USER WHERE OBJID=LEAD_OWNER2USER) "Owner",
                (SELECT NAME FROM TABLE_CAMPAIGN WHERE OBJID=(SELECT source2campaign FROM TABLE_LEAD_SOURCE WHERE OBJID=LEAD2LEAD_SOURCE)) "Campaign",
                (SELECT NAME FROM TABLE_LEAD_SOURCE WHERE OBJID=LEAD2LEAD_SOURCE) "Lead Source", 
                LEAD_COMMENTS "Comments", 
                (SELECT TITLE FROM table_hgbst_elm a where a.objid=X_HOME_OWNERSHIP2HGBST_ELM) "Home Ownership", 
                (SELECT TITLE FROM table_hgbst_elm a where a.objid=X_DWELLING_TYPE2HGBST_ELM) "Dwelling Type",
                (SELECT TITLE FROM table_hgbst_elm a where a.objid=X_CUST_TYPE2HGBST_ELM) "Customer Type", 
                (SELECT TITLE FROM table_hgbst_elm a where a.objid=X_CUST_SUBTYPE2HGBST_ELM) "Customer Sub Type"
                From table_lead l where x_prospect_id = :lead_id`;
  return query;
};

const leadOverviewAddressesQuery = () => {
  const query = `SELECT 'Service Address' as ADD_TYPE, X_MAILING_LABEL1 "Address 1", X_MAILING_LABEL2 "Address 2", X_MAILING_LABEL3 "Address 3", X_MAILING_LABEL4 "Address 4", X_MAILING_LABEL5 "Address 5" 
                From table_address where objid=:leadBillingAddress
                UNION ALL
                SELECT 'Billing Address' as ADD_TYPE, X_MAILING_LABEL1 "Address 1", X_MAILING_LABEL2 "Address 2", X_MAILING_LABEL3 "Address 3", X_MAILING_LABEL4 "Address 4", X_MAILING_LABEL5 "Address 5"
                From table_address where objid=:leadServiceAddress`;
  return query;
};

const leadOverviewMoreInfoQuery = () => {
  const query = `SELECT ATTRIBUTE_NAME, CASE WHEN ATTRIBUTE_NAME='x_is_existing_contact' THEN (CASE WHEN S_ATTRIBUTE_VALUE!='FALSE' THEN 'YES' ELSE 'NO' END) WHEN ATTRIBUTE_NAME='x_is_contact_premium' THEN (CASE WHEN S_ATTRIBUTE_VALUE!='FALSE' THEN 'YES' ELSE 'NO' END) ELSE S_ATTRIBUTE_VALUE END S_ATTRIBUTE_VALUE
                From table_fa_lead fl where attribute_name IN ('x_dob', 'x_gender', 'x_office_phone', 'x_office_phone_ext', 'x_order_id', 'x_churn_status', 'x_is_existing_contact', 'x_is_contact_premium', 'x_prefContactChann', 'x_bill_format', 'x_bill_freq', 'x_pref_lang', 'x_profession', 'x_monthly_income', 'x_race', 'x_prefCallTime', 'x_prefCallTimeTo')
                and fa_lead2lead = :objId
                UNION ALL
                SELECT 'payment_details' AS ATTRIBUTE_NAME, CASE WHEN x_lead2pay_means IS NULL THEN 'Cash' ELSE 'Credit Card' END AS ATTRIBUTE_VALUE 
                FROM table_lead WHERE objid=:objId`;
  return query;
};

const leadOverviewRelatedAccountsQuery = () => {
  const query = `SELECT X_ACCOUNT_ID, X_ACCOUNT_NAME 
                FROM table_x_lead_account WHERE x_lead_account2lead = :objId`;
  return query;
};

const leadHistoryQuery = () => {
  const query = `SELECT (SELECT title FROM table_gbst_elm WHERE rank=act_code and rownum = 1) "Activity", TO_CHAR(entry_time,'dd-Mon-yyyy hh:mi:ss AM') "Creation Time",
  (SELECT s_login_name FROM table_user x WHERE x.objid=act_entry2user) "Login Name", addnl_info "Additional Information" From table_act_entry where focus_type in (5312)
  and focus_lowId = (Select objid from table_lead where x_prospect_id=:lead_id)`;
  return query;
};

const leadAttachmentQuery = () => {
  const query =
    'SELECT TITLE, DESCRIPTION From table_doc_inst where doc_inst2lead = (SELECT objid from table_lead where x_prospect_id=:lead_id) AND DELETED = 0';
  return query;
};

const searchByLeadID = () => {
  const query = `SELECT X_PROSPECT_ID, S_FIRST_NAME 
                From table_lead l WHERE x_prospect_id = :search_value ORDER BY S_FIRST_NAME, X_PROSPECT_ID`;
  return query;
};

const searchByLeadName = (value) => {
  const query = `SELECT X_PROSPECT_ID, S_FIRST_NAME 
                From table_lead l WHERE upper(s_first_name) like upper('%${value}%') and rownum <=50 ORDER BY S_FIRST_NAME, X_PROSPECT_ID`;
  return query;
};

const searchByLeadMobile = () => {
  const query = `SELECT X_PROSPECT_ID, S_FIRST_NAME 
                From table_lead l WHERE mobile_phone=:search_value ORDER BY S_FIRST_NAME, X_PROSPECT_ID`;
  return query;
};

const searchByLeadHomeNumber = () => {
  const query = `SELECT X_PROSPECT_ID, S_FIRST_NAME From table_lead l WHERE objid in (Select fa_lead2lead From table_fa_lead fl where attribute_name='x_home_phone'
                and s_attribute_value=:search_value) ORDER BY S_FIRST_NAME, X_PROSPECT_ID`;
  return query;
};

const searchByLeadOfficeNumber = () => {
  const query = `SELECT X_PROSPECT_ID, S_FIRST_NAME From table_lead l WHERE objid in (Select fa_lead2lead From table_fa_lead fl where attribute_name='x_office_phone'
                and s_attribute_value=:search_value) ORDER BY S_FIRST_NAME, X_PROSPECT_ID`;
  return query;
};

const searchByLeadOrderID = (value) => {
  const query = `SELECT X_PROSPECT_ID, S_FIRST_NAME 
                From table_lead l WHERE objid in (Select fa_lead2lead From table_fa_lead fl where attribute_name='x_order_id' and s_attribute_value='${value}')`;
  return query;
};

// Lead Module Order Details Queries
const orderByLeadIdQuery = () => {
  const query = `SELECT REPLACE(s_attribute_value, 'A', '') OrderId FROM table_fa_lead fl WHERE attribute_name = 'x_order_id' AND 
                  fa_lead2lead=(SELECT objid FROM table_lead WHERE x_prospect_id=:lead_id)`;
  return query;
};

const leadOrderDetailsQuery = () => {
  const query = `Select 
  (Select (Select name_text from tbname where cid=item_def_id and language='EN' and rownum=1) b
  From tbap_item where ap_id IN (a.ap_id_dominant) and entity_type like '%ApOffer')  "Offer Name",
  item_def_id, order_mode,
  (Select CAPTION From tbdecode where 
  decode_id=(Select DECODE_ID From tbvalid_value where domain_name = 'APState' and discrete_code = a.state)
  AND LANGUAGE_ID='EN')  "State",
  (Select CAPTION From tbdecode 
  where decode_id=(Select DECODE_ID From tbvalid_value where domain_name = 'APStatus' and discrete_code = a.status)
  AND LANGUAGE_ID='EN')  "Status",
  CTDB_UPD_DATETIME,
  (Select Street_Number || ' ' || Street_Name || ' ' || Municipality || ' ' || Post_Code || ' ' || State || ' ' || Country
  From tbaddress Where address_id=a.INSTAL_ADDRESS_ID) "Installation Address",
  (Select CAPTION From tbdecode 
  where decode_id=(Select DECODE_ID From tbvalid_value where domain_name = 'AbsServiceType' and discrete_code = a.service_type)
  AND LANGUAGE_ID='EN') "Service Type",
  prov_date "Initial Provisioning Date",
  (Select First_Name || ' ' || Last_Name from tbcustomer tc where tc.customer_id=a.customer_id) "Subscriber",
  (Select reason From tboa_reason_codes where reason_id=a.reason and language='EN' and rownum=1) "Order Action Reason",
  'Subscriber' "Group Level",
  ITEM_ATRS_LIST "Attribute List",
  main_ind,
  service_type "Service Type Code",
  ap_id, service_id
  From
  (
  Select ap_id, ap_version_id, item_def_id, order_mode, state, status, CTDB_UPD_DATETIME,
  INSTAL_ADDRESS_ID, service_type, ITEM_ATRS_LIST, ap_id_dominant, prov_date, customer_id, reason,main_ind,service_id,
  row_number() over(PARTITION BY item_def_id order by ap_version_id desc) rn
  FROM tbap_item WHERE main_item_id=
  (SELECT ap_id FROM
  (
  SELECT ap_id, row_number() over(ORDER BY ap_version_id DESC) rn
  FROM tborder_action WHERE order_id=:orderId
  ) ao WHERE ao.rn=1)
  AND (item_def_id IN (381, 451, 461833) OR service_type IN ('TVMC', 'COMM', 'INST', 'STB', 'SMC', 'GRP'))
  AND status='AC'
  ) a WHERE rn=1
  ORDER BY main_ind DESC`;
  return query;
};

const pairingChannelsQuery = () => {
  const query = `SELECT (SELECT name_text FROM tbname WHERE CID=a.item_def_id AND LANGUAGE='EN' AND PCVERSION_ID=(SELECT MAX(PCVERSION_ID) FROM tbname WHERE cid = a.item_def_id AND LANGUAGE='EN')) Name,
  '' Value FROM
  (
      SELECT t1.ap_version_id, t1.item_def_id, t1.service_type,
      row_number() over(PARTITION BY t1.item_def_id ORDER BY t1.ap_version_id DESC) rn
      FROM tbap_item t1 WHERE t1.ap_id_dominant=:apids
  ) a WHERE rn=1`;
  return query;
};

const leadConfigPackageListQuery = (params) => {
  const query = `SELECT CASE WHEN SubPackage IS NOT NULL THEN Package || ' - ' || SubPackage ELSE Package END Package, Pricing FROM
  (
  SELECT
  (SELECT name_text FROM tbname WHERE CID=a.item_def_id AND LANGUAGE='EN' AND PCVERSION_ID=(SELECT MAX(PCVERSION_ID) FROM tbname WHERE cid = a.item_def_id AND LANGUAGE='EN')) Package,
  (SELECT name_text FROM tbname WHERE CID=a.t2item_def_id AND LANGUAGE='EN' AND PCVERSION_ID=(SELECT MAX(PCVERSION_ID) FROM tbname WHERE cid = a.t2item_def_id AND LANGUAGE='EN')) SubPackage,
  CASE
  WHEN a.service_type IS NULL THEN
  (SELECT  actual_price  FROM tbap_charge_info WHERE (order_action_id, ap_item_id, status, ap_version_id, ctdb_upd_datetime) =
  (SELECT order_action_id, ap_item_id, status, MAX(ap_version_id), MAX(ctdb_upd_datetime) FROM tbap_charge_info WHERE order_action_id=a.order_action_id AND ap_item_id=a.ap_id AND status='AC' GROUP BY order_action_id, ap_item_id, status))
  WHEN a.t2service_type IS NULL THEN
  (SELECT  actual_price  FROM tbap_charge_info WHERE (order_action_id, ap_item_id, status, ap_version_id, ctdb_upd_datetime) =
  (SELECT order_action_id, ap_item_id, status, MAX(ap_version_id), MAX(ctdb_upd_datetime) FROM tbap_charge_info WHERE order_action_id=a.t2order_action_id AND ap_item_id=a.t2ap_id AND status='AC' GROUP BY order_action_id, ap_item_id, status))
  END Pricing
  FROM
  (
  SELECT t1.ap_id, t1.ap_version_id, t1.item_def_id, t1.service_type, t1.order_action_id,
  t2.ap_id t2ap_id, t2.ap_version_id t2ap_version_id, t2.item_def_id t2item_def_id, t2.service_type t2service_type, t2.order_action_id t2order_action_id,
  row_number() over(PARTITION BY t1.item_def_id, t2.item_def_id ORDER BY t1.ap_version_id, t2.ap_version_id DESC) rn
  FROM tbap_item t1 LEFT JOIN tbap_item t2 ON t1.ap_id=t2.ap_id_dominant AND t1.state=t2.state AND t1.status=t2.status
  WHERE t1.status='AC' AND t1.ap_id_dominant IN (${params})) a WHERE rn=1 )`;
  return query;
};

const subscriptionCustomerId = () => {
  const query = `SELECT customer_no "custID", ba.billing_arrangement_id "blarrange"
  FROM ar1_account ac, ar1_billing_arrangement ba
  WHERE ba.account_id=ac.account_id AND ac.account_id=:account_id`;
  return query;
};

const subscriptionPackagePrice = () => {
  const query = `SELECT (SELECT DESCRIPTION FROM bl1_charge_code WHERE charge_code =a.charge_code AND ROWNUM=1) AS DESCRIPTION, AMOUNT
  FROM bl1_rc_rates a
  WHERE receiver_customer=:customerId AND service_receiver_id=:subNumber
  AND expiration_date IS NULL`;
  return query;
};
const DCAFlashMessagesQuery = () => {
  const query = `select Title,
  start_date  StartDate,
   end_date EndDate,
  case when TA.active=1 then 'INACTIVE' else 'ACTIVE' end  Status,
     SUBSTR(TA.alert_text,1,4000) Text
from   table_alert TA,
     TABLE_BUS_ORG TBO
where  TBO.S_ORG_ID=:account_id
and    TA.alert2bus_org=TBO.objid`;
  return query;
};
const winleadFlashMessagesQuery = () => {
  const query = `select Title,
  start_date  StartDate,
   end_date EndDate,
  case when TA.active=1 then 'INACTIVE' else 'ACTIVE' end  Status,
     SUBSTR(TA.alert_text,1,4000) Text
from   table_alert TA,
     TABLE_BUS_ORG TBO
where  TBO.S_ORG_ID=:account_id
and    TA.alert2bus_org=TBO.objid`;
  return query;
};

/* eslint-disable */
const subscriptionPackageInfoDetails = () => {
  // eslint-disable-next-line no-case-declarations
  const query = `SELECT
  CASE WHEN a.service_type='STB' THEN
  TO_CHAR(a.name_text) || ' - '  ||
  to_char(regexp_substr( regexp_substr(a.item_atrs_list,'[^;]+',instr(a.item_atrs_list,'DecoderType'),1),'[^\+]+',1,2)) || ' ' ||
  to_char(regexp_substr( regexp_substr(a.item_atrs_list,'[^;]+',instr(a.item_atrs_list,'ModelNo'),1),'[^\+]+',1,2))
  ELSE TO_CHAR(a.name_text) END service,
  CASE WHEN a.service_type='STB' THEN
  to_char(regexp_substr( regexp_substr(a.item_atrs_list,'[^;]+',instr(a.item_atrs_list,'Manufacturer'),1),'[^\+]+',1,2))
  ELSE
  CASE WHEN a.service_type IS NOT NULL THEN
  (SELECT TO_CHAR(name_text) FROM tbname WHERE cid = t3item_def_id AND LANGUAGE='EN' AND t3item_def_ver=PCVERSION_ID) ELSE NULL END END servicetype,
  CASE WHEN a.service_type='STB' THEN
  TO_CHAR(a.service_id) ELSE NULL END resourceid,
  TO_CHAR((SELECT CAPTION FROM tbdecode WHERE LANGUAGE_ID='EN' AND OWNERSHIP='OMS' AND UPPER(DECODE_ID) LIKE UPPER('APSTATUS_' || a.status)))  status,
  REPLACE(TO_CHAR(a.start_date,'dd-Mon-yyyy hh:mi:ss AM'),'12:00:00 AM','') "StartDate",
  REPLACE(TO_CHAR(a.end_date,'dd-Mon-yyyy hh:mi:ss AM'),'12:00:00 AM','') "ServiceEndDate",
  CASE WHEN a.service_type='COMM' THEN
  REPLACE(TO_CHAR(TO_DATE(SUBSTR(TO_CHAR(a.item_atrs_list),  INSTR(a.item_atrs_list, ';CommitmentEndDate+' , 1, 1)+19,
  INSTR(a.item_atrs_list, '+DT' , INSTR(a.item_atrs_list, ';CommitmentEndDate+' , 1, 1)+19, 1)-(INSTR(a.item_atrs_list, ';CommitmentEndDate+' , 1, 1)+19)),
  'dd-MM-yyyy hh24:mi:ss'),'dd-Mon-yyyy hh:mi:ss AM'),'12:00:00 AM','')
  ELSE NULL END commitmentenddate
  FROM (
  SELECT b.*, row_number() over (PARTITION BY item_def_id ORDER BY start_date DESC) rn2
  FROM
  (
  SELECT
  t1.ap_id AS main_ap_id,
  t2.item_def_id,
  t2.ap_id,
  t2.ap_version_id,
  t2.order_action_id,
  t2.service_type,
  t2.service_id,
  t2.item_atrs_list,
  t2.start_date,
  t2.end_date,
  t2.status,
  t2.state,
  t3.item_def_id AS t3item_def_id,
  t3.item_def_ver AS t3item_def_ver,
  cid.name_text,
  row_number() over (PARTITION BY t2.main_item_id, t2.item_def_id ORDER BY TO_NUMBER(t2.ap_version_id) DESC) rn
  FROM
  (
  SELECT a.ap_id FROM
  (
  SELECT
  ap_id, row_number() over (PARTITION BY service_type ORDER BY start_date DESC) rn
  FROM tbap_item WHERE service_id=:smc_no AND main_ind='1' AND state = 'AS' AND status='AC'
  ) a WHERE rn=1
  ) t1
  INNER JOIN tbap_item t2 ON (t1.ap_id = t2.main_item_id AND t2.state='AS' )
  LEFT OUTER JOIN tbap_item t3 ON (t3.ap_id=t2.ap_id_dominant)
  LEFT OUTER JOIN tbname cid ON (t2.item_def_id=cid.cid AND cid.LANGUAGE='EN')
  WHERE
  t2.end_date >= SYSDATE AND t2.start_date <= SYSDATE
  AND NOT t2.item_def_id IN (1661) AND t2.status='AC'
  AND cid.PCVERSION_ID=t2.item_def_ver
  AND ((t2.service_type IS NULL AND (cid.name_text LIKE 'Basic%')) OR t2.service_type NOT IN ( 'GRP', 'INT', 'INST', 'SMC', 'CHAN'))
  AND t3.service_type NOT IN ('PACK')
  ) b
  WHERE rn=1
  ) a WHERE rn2=1
  UNION ALL
  select TO_CHAR(b.name_text), null service_type, null resourceid,
  TO_CHAR((SELECT CAPTION FROM tbdecode WHERE LANGUAGE_ID='EN' AND OWNERSHIP='OMS' AND UPPER(DECODE_ID) LIKE UPPER('APSTATUS_' || a.status))) status,
  REPLACE(TO_CHAR(a.start_Date,'dd-Mon-yyyy hh:mi:ss AM'),'12:00:00 AM','') startDate,
  REPLACE(TO_CHAR(a.end_Date,'dd-Mon-yyyy hh:mi:ss AM'),'12:00:00 AM','') endDate, null commitmentdate
  From tbap_price_plan a LEFT JOIN tbname b ON a.item_def_id=b.cid
  and a.item_def_ver=b.pcversion_id and b.Language='EN'
  where main_item_id
  IN (SELECT a.ap_id FROM
  (
  SELECT
  ap_id, item_def_id , service_id, row_number() over (PARTITION BY service_type ORDER BY start_date DESC) rn
  FROM tbap_item WHERE service_id=:smc_no AND main_ind='1' AND state = 'AS' AND status='AC'
  ) a WHERE rn=1)
  and a.end_date >= SYSDATE AND a.start_date <= SYSDATE
  ORDER BY resourceid, commitmentenddate, servicetype, service ASC`;
  return query;
};

const DCAFreePreviewQuery = (account_id) =>{
  const query = `SELECT tsp.S_SERIAL_NO SMC, tsp.s_part_status Status,
  GET_ATTR_VALUE(ITEM_ATRS_LIST,'ChannelName') ChannelName,
               GET_ATTR_VALUE(ITEM_ATRS_LIST,'FPChannelCode') ChannelCode,
               GET_ATTR_VALUE(ITEM_ATRS_LIST,'FreeViewStartDate') StartDate,
               GET_ATTR_VALUE(ITEM_ATRS_LIST,'FreeViewEndDate') EndDate           
        FROM  TABLE_CONTACT_ROLE@OMSSEL2CRM CR,
              TABLE_BUS_ORG@OMSSEL2CRM tbo,
              TABLE_SITE@OMSSEL2CRM ts,
              TABLE_SITE_PART@OMSSEL2CRM tsp,
              TBAP_ITEM ti
       WHERE CONTACT_ROLE2BUS_ORG=tbo.objid
       AND   tbo.s_org_id=:account_id
       AND   ts.objid=cr.CONTACT_ROLE2SITE
       AND   tsp.ALL_SITE_PART2SITE=ts.objid
       AND   tsp.LEVEL_TO_BIN=1
       AND   ti.MAIN_ITEM_ID=tsp.x_ap_id
       AND   ti.state = 'AS'
       AND   service_type ='PRV'
       AND   end_date > REPLACE(to_date(SYSDATE,'dd-MM-yyyy'),'')`;
       return query;
}

const winleadFreePreviewQuery = (account_id) =>{
  const query = `SELECT tsp.S_SERIAL_NO SMC, tsp.s_part_status Status,
  GET_ATTR_VALUE(ITEM_ATRS_LIST,'ChannelName') ChannelName,
               GET_ATTR_VALUE(ITEM_ATRS_LIST,'FPChannelCode') ChannelCode,
               GET_ATTR_VALUE(ITEM_ATRS_LIST,'FreeViewStartDate') StartDate,
               GET_ATTR_VALUE(ITEM_ATRS_LIST,'FreeViewEndDate') EndDate           
        FROM  TABLE_CONTACT_ROLE@OMSSEL2CRM CR,
              TABLE_BUS_ORG@OMSSEL2CRM tbo,
              TABLE_SITE@OMSSEL2CRM ts,
              TABLE_SITE_PART@OMSSEL2CRM tsp,
              TBAP_ITEM ti
       WHERE CONTACT_ROLE2BUS_ORG=tbo.objid
       AND   tbo.s_org_id=:account_id
       AND   ts.objid=cr.CONTACT_ROLE2SITE
       AND   tsp.ALL_SITE_PART2SITE=ts.objid
       AND   tsp.LEVEL_TO_BIN=1
       AND   ti.MAIN_ITEM_ID=tsp.x_ap_id
       AND   ti.state = 'AS'
       AND   service_type ='PRV'
       AND   end_date > REPLACE(to_date(SYSDATE,'dd-MM-yyyy'),'')`;
       return query;
}
module.exports = {
  subscriptionInfoQuery,
  contactInfoQuery,
  accountInfoQuery,
  searchCriteria,
  searchBySMC,
  searchByInvoiceNo,
  searchByIC,
  searchByAccountNo,
  DCAaddressInfoQuery,
  addressInfoQuery,
  interactionInfoQuery,
  caseInfoQuery,
  billingInfoQuery,
  billingSummaryQuery,
  pdpaInfoQuery,
  caseHistoryInfoQuery,
  caseFulfillmentOrderInfoQuery,
  caseFulfillmentDetailsInfoQuery,
  caseFlexibleAttributesInfoQuery,
  caseDetailsInfoQuery,
  caseInfoSubCaseQuery,
  getSmartCardNumbers,
  getApIdFromSmartCardNumber,
  leadOverviewQuery,
  leadOverviewAddressesQuery,
  leadOverviewMoreInfoQuery,
  leadOverviewRelatedAccountsQuery,
  leadHistoryQuery,
  leadAttachmentQuery,
  searchByLeadID,
  searchByLeadName,
  searchByLeadMobile,
  searchByLeadHomeNumber,
  searchByLeadOfficeNumber,
  searchByLeadOrderID,
  leadSearchCriteria,
  orderByLeadIdQuery,
  leadOrderDetailsQuery,
  pairingChannelsQuery,
  leadConfigPackageListQuery,
  subscriptionCustomerId,
  subscriptionPackagePrice,
  subscriptionPackageInfoDetails,
  getPrimaryNumberQuery,
  getStatusForPriceCalculator,
  activeSmcPriceCalculator,
  suspendedSmcPriceCalculator,
  getCustomerIdPriceCalculator, 
  winleadFlashMessagesQuery,
  DCAFlashMessagesQuery,
  DCAFreePreviewQuery,
  winleadFreePreviewQuery
};
