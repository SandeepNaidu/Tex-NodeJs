// CRM DB
exports.interactionInfoQuery = () => {
  return `SELECT
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
};

// CRM DB
exports.interactionInfoWinleadQuery = () => {
  return `
    SELECT TO_CHAR(a.start_time,'dd-Mon-yyyy hh12:mi:ss AM') "Start Time",    
    a.title "Title", a.Type "Media", 
    case when a.direction = 1 then 'Inbound' when a.direction = 2 then 'Outbound' else null end "Direction", 
    notes "Notes"
    FROM table_intrxn a, table_bus_org b,table_session c,table_user d, table_employee e
    WHERE a.intrxn2bus_org = b.objid
    AND b.s_org_id = :account_id
    AND c.session2intrxn=a.objid
    AND c.session2user=d.objid(+)
    AND e.employee2user(+)=d.objid
    ORDER BY a.start_time DESC
    `;
};

exports.interactionInfoDcaQuery = () => {
  return `
    SELECT TO_CHAR(a.start_time,'dd-Mon-yyyy hh12:mi:ss AM') "Start Time",    
    a.title "Title", a.Type "Media", 
    case when a.direction = 1 then 'Inbound' when a.direction = 2 then 'Outbound' else null end "Direction", 
    notes "Notes"
    FROM table_intrxn a, table_bus_org b,table_session c,table_user d, table_employee e
    WHERE a.intrxn2bus_org = b.objid
    AND b.s_org_id = :account_id
    AND c.session2intrxn=a.objid
    AND c.session2user=d.objid(+)
    AND e.employee2user(+)=d.objid
    ORDER BY a.start_time DESC
    `;
};
