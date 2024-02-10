exports.fetchChildRolesQuery = `
  SELECT r.* FROM roles r
  JOIN sub_roles child on child.user_role_id = r.id
  WHERE child.admin_role_id = :parent_role_id
`;

exports.fetchChildsQuery = `SELECT 
    _id, 
    previous, 
    level, 
    childUserId, 
    r.* 
  FROM roles r
  JOIN (
  SELECT
    @parent AS _id, 
    @previous := @parent AS previous,
    @lvl := @lvl + 1 AS level,
    IFNULL(
      (
        SELECT @parent := id  
        FROM roles 
        WHERE parent_role_id = _id 
        LIMIT 1
      ), 
      @parent := -1
    ) AS childUserId
  FROM roles,
    (SELECT @parent := id, 
      @lvl := 0,  
      @bu := business_unit_id ,
          @previous = 0
      FROM roles 
      WHERE 
      parent_role_id = :parent_role_id
    ) vars 
  WHERE 
  business_unit_id = @bu 
  ) children ON children._id = r.id`;

exports.getfetchRolesQuery = (paramsObj, queryObj, currentUser) => {
  const businessUnit = paramsObj.business_unit;
  const userType = paramsObj.user_type;
  const userTypeId = queryObj.user_type_id;
  // let query = `SELECT bu.business_unit, ut.user_type, r.*, parent.type as parent_type, parent.name as parent_name FROM roles r
  //   INNER JOIN roles parent on parent.id = r.parent_role_id
  //   JOIN tex_usiness_units bu on bu.id = r.business_unit_id
  //   JOIN tex_user_types ut on ut.id = r.user_type_id WHERE 1 = 1 `;
  let query = `SELECT bu.business_unit, ut.user_type, r.*, parent.type as parent_type, parent.name as parent_name 
      FROM sub_roles sr
      JOIN roles r on r.id = sr.user_role_id
      INNER JOIN roles parent on r.parent_role_id = parent.id
      JOIN users u on u.roleId = sr.admin_role_id
      JOIN tex_business_unit_user_types buut on buut.business_unit_id = r.business_unit_id and buut.user_type_id = r.user_type_id
      JOIN tex_business_units bu on bu.id = buut.business_unit_id
    JOIN tex_user_types ut on ut.id = r.user_type_id
    WHERE 1=1
    and r.status = 1
    and sr.admin_role_id = u.roleId`;
  const businessUnitQuery = `and bu.business_unit = '${businessUnit}' `;
  const userTypeQuery = ` and ut.user_type = '${userType}' `;
  const userTypeIdQuery = ` and ut.id = ${userTypeId} `;
  if (currentUser) {
    query = query + ` AND u.username like '${currentUser}' `;
  }
  if (businessUnit) {
    query = query + businessUnitQuery;
  }
  if (userType) {
    query = query + userTypeQuery;
  }
  if (userTypeId) {
    query = query + userTypeIdQuery;
  }
  const orderByClause = ' ORDER BY bu.id, r.user_type_id';
  query += orderByClause;
  return query;
};

exports.getSuperAdminRole = () => {
  const query = `SELECT r.* from roles r where type = '${process.env.SUPER_ADMIN_ROLE ? process.env.SUPER_ADMIN_ROLE : 'superAdmin'}'`;
  return query;
};

exports.fetchParentRolesQuery = (queryObj) => {
  let query = `SELECT 
  bu.business_unit, ut.user_type,
  _id, 
  previous, 
  r.*,
  parent.type as parent_type, parent.name as parent_name
  FROM roles r
  JOIN (
  SELECT
  @parent AS _id, 
  @previous := @parent AS previous,
  @lvl := @lvl + 1 AS level,
  IFNULL(
    (
      SELECT @parent := parent_role_id  
      FROM roles 
      WHERE id = _id 
      LIMIT 1
    ), 
    @parent := -1
  ) AS childUserId
  FROM roles,
  (SELECT @parent := id, 
    @lvl := 0,  
    @bu := business_unit_id ,
        @previous = 0
    FROM roles 
    WHERE 
    id = ${queryObj.roleId}
  ) vars 
  WHERE @parent != -1
  ) children ON children._id = r.id
  LEFT JOIN roles parent on r.parent_role_id = parent.id
  JOIN tex_business_unit_user_types buut on buut.business_unit_id = r.business_unit_id and buut.user_type_id = r.user_type_id
  JOIN tex_business_units bu on bu.id = buut.business_unit_id
  JOIN tex_user_types ut on ut.id = r.user_type_id 
  WHERE 1 = 1 `;

  if (queryObj.userType) {
    const userTypeClause = `AND ut.user_type = '${queryObj.userType}' `;
    query += userTypeClause;
  };

  return query;
};

const getUserInfoQuery = (queryObj) => {
  const query = `SELECT 
    u.id,
    u.firstName,
    u.lastName,
    u.username,
    u.email,
    u.contactNumber,
    bu.business_unit,
    bu.business_unit_name,
    u.roleId,
    r.type as roleType,
    r.name as roleName,
    ut.user_type,
    ut.user_type_name,
    u.parentUserId,
    parent.username as parentUserName,
    u.agencyId, 
    u.employeeId,
    IF(bu.business_unit = 'DCA', 
      CASE 
        WHEN ut.user_type = 'ASTRO_ADMIN' THEN 'ADMIN'
        ELSE agency.agencyCode
      END , IF(agency.agencyCode IS NULL, '-', agency.agencyCode)) as agencyCode,
    IF(bu.business_unit = 'DCA', 
      CASE 
        WHEN ut.user_type = 'ASTRO_ADMIN' THEN 'Admin'
        ELSE agency.agencyName
      END , IF(agency.agencyName IS NULL, '-', agency.agencyName)) as agencyName,
    agency.agencyPIC,
    IFNULL(agency.loginTime, u.loginTime) as loginTime,
    IFNULL(agency.logoutTime, u.logoutTime) as logoutTime,
    IF (u.isActive = 1, true, false) as enabled,
    IF (u.isDeleted = 'N', false, true) as deleted,
    IF(u.forceReset = 1, 'FORCE_CHANGE_PASSWORD' , 'CONFIRMED' ) as status,
    u.forceReset,
    u.isActive,
    u.isDeleted,
    u.notes,
    u.createdBy,
    u.creationDate,
    u.updatedBy,
    u.updationDate,
    u.reportingManager,
    u.reportingManagerEmail,
    u.resourceType,
    u.reportingLocation
  FROM
    users u
      JOIN roles r on r.id = u.roleId
      JOIN tex_user_types ut on ut.id = r.user_type_id
      JOIN tex_business_unit_user_types buut on buut.user_type_id = ut.id and r.business_unit_id = buut.business_unit_id
      JOIN tex_business_units bu on bu.id = buut.business_unit_id
      LEFT JOIN tex_agencies agency on agency.id = u.agencyId
      LEFT JOIN users parent on parent.id = u.parentUserId
  WHERE 
    1 = 1 
    and u.username = '${queryObj.username}'`;
  return query;
};

exports.getUserInfoQuery = getUserInfoQuery;
