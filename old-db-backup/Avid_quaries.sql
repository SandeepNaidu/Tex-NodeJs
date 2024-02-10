
CREATE TABLE tex_avid (
    avidId int unsigned NOT NULL AUTO_INCREMENT,
    artistId int UNSIGNED NOT NULL,
    content varchar(255) NOT NULL,
    coverContent varchar(255) NOT NULL,
    title varchar(150) NOT NULL,
    caption text NOT NULL,
    hashTag varchar(255)  NOT NULL,
    mode varchar(25) NOT NULL,
    createAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updateAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (avidId),
    FOREIGN KEY (artistId) REFERENCES users(id)
);

CREATE TABLE avid_like_mapping (
    id int unsigned NOT NULL AUTO_INCREMENT,
    avidId int unsigned NOT NULL,
    artistId int UNSIGNED NOT NULL,
    createAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (avidId) REFERENCES tex_avid(avidId),
    FOREIGN KEY (artistId) REFERENCES users(id)
);


CREATE TABLE avid_share_mapping (
    id int unsigned NOT NULL AUTO_INCREMENT,
    avidId int unsigned NOT NULL,
    artistId int UNSIGNED NOT NULL,
    createAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (avidId) REFERENCES tex_avid(avidId),
    FOREIGN KEY (artistId) REFERENCES users(id)
);

CREATE TABLE avid_save_mapping (
    id int unsigned NOT NULL AUTO_INCREMENT,
    avidId int unsigned NOT NULL,
    artistId int UNSIGNED NOT NULL,
    createAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (avidId) REFERENCES tex_avid(avidId),
    FOREIGN KEY (artistId) REFERENCES users(id)
);

CREATE TABLE avid_tag (
    id int unsigned NOT NULL AUTO_INCREMENT,
    name varchar(100) NOT NULL,
    createAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY (name)
);

--     Post creation quaries......

CREATE TABLE post_image (
    postImageId int unsigned NOT NULL AUTO_INCREMENT,
    imageUrl varchar(255) NOT NULL,
    thumbUrl varchar(255) NOT NULL,
    caption text NOT NULL,
    hashTag varchar(255),
    latlong varchar(255),
    address varchar(255),
    createAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (postImageId)
);

CREATE TABLE post_video (
    postVideoId int unsigned NOT NULL AUTO_INCREMENT,
    videoUrl varchar(255) NOT NULL,
    thumbUrl varchar(255) NOT NULL,
    caption text NOT NULL,
    hashTag varchar(255),
    latlong varchar(255),
    address varchar(255),
    createAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (postVideoId)
);

CREATE TABLE post_document (
    postDocumentId int unsigned NOT NULL AUTO_INCREMENT,
    documentUrl varchar(255) NOT NULL,
    thumbUrl varchar(255) NOT NULL,
    caption text NOT NULL,
    hashTag varchar(255),
    latlong varchar(255),
    address varchar(255),
    createAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (postDocumentId)
);

CREATE TABLE post_audio (
    postAudioId int unsigned NOT NULL AUTO_INCREMENT,
    audioUrl varchar(255) NOT NULL,
    thumbUrl varchar(255) NOT NULL,
    caption text NOT NULL,
    hashTag varchar(255),
    latlong varchar(255),
    address varchar(255),
    createAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (postAudioId)
);

CREATE TABLE post_event (
    postEventId int unsigned NOT NULL AUTO_INCREMENT,
    eventImageUrl varchar(255) NOT NULL,
    eventType enum('Inperson','Online') NOT NULL,
    eventFormat varchar(255) NOT NULL,
    event varchar(255) NOT NULL,
    eventExternalLink varchar(255) NOT NULL,
    description text NOT NULL,
    hashTag varchar(255),
    latlong varchar(255),
    address varchar(255),
    createAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (postEventId)
);

CREATE TABLE post_poll (
    postPollId int unsigned NOT NULL AUTO_INCREMENT,
    question text NOT NULL,
    options text NOT NULL,
    duration int UNSIGNED NOT NULL,
    hashTag varchar(255),
    latlong varchar(255),
    address varchar(255),
    createAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (postPollId)
);

CREATE TABLE tex_post (
    id int unsigned NOT NULL AUTO_INCREMENT,
    artistId int UNSIGNED NOT NULL,
    postType enum('Image','Video','Music','Document','Event','Poll') NOT NULL,
    postTypeId int UNSIGNED NOT NULL,
    createAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (artistId) REFERENCES users(id)
);

CREATE TABLE poll_vote (
    pollVoteId int unsigned NOT NULL AUTO_INCREMENT,
    artistId int UNSIGNED NOT NULL,
    postId int UNSIGNED NOT NULL,
    voteOption text NOT NULL,
    createAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (pollVoteId),
    FOREIGN KEY (artistId) REFERENCES users(id),
    FOREIGN KEY (postId) REFERENCES tex_post(id)
);


CREATE TABLE post_like_mapping (
    id int unsigned NOT NULL AUTO_INCREMENT,
    postId int unsigned NOT NULL,
    artistId int UNSIGNED NOT NULL,
    createAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (postId) REFERENCES tex_post(id),
    FOREIGN KEY (artistId) REFERENCES users(id)
);


CREATE TABLE post_share_mapping (
    id int unsigned NOT NULL AUTO_INCREMENT,
    postId int unsigned NOT NULL,
    artistId int UNSIGNED NOT NULL,
    createAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (postId) REFERENCES tex_post(id),
    FOREIGN KEY (artistId) REFERENCES users(id)
);

CREATE TABLE post_save_mapping (
    id int unsigned NOT NULL AUTO_INCREMENT,
    postId int unsigned NOT NULL,
    artistId int UNSIGNED NOT NULL,
    createAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (postId) REFERENCES tex_post(id),
    FOREIGN KEY (artistId) REFERENCES users(id)
);


CREATE TABLE post_report_mapping (
    id int unsigned NOT NULL AUTO_INCREMENT,
    postId int unsigned NOT NULL,
    artistId int UNSIGNED NOT NULL,
    createAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (postId) REFERENCES tex_post(id),
    FOREIGN KEY (artistId) REFERENCES users(id)
);




CREATE TABLE profile_like (
    id int unsigned NOT NULL AUTO_INCREMENT,
    artistId int UNSIGNED NOT NULL,
    likedBy int unsigned NOT NULL,
    createAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (likedBy) REFERENCES users(id),
    FOREIGN KEY (artistId) REFERENCES users(id)
);


CREATE TABLE profile_share (
    id int unsigned NOT NULL AUTO_INCREMENT,
    artistId int UNSIGNED NOT NULL,
    sharedBy int unsigned NOT NULL,
    createAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (sharedBy) REFERENCES users(id),
    FOREIGN KEY (artistId) REFERENCES users(id)
);

CREATE TABLE profile_save (
    id int unsigned NOT NULL AUTO_INCREMENT,
    artistId int UNSIGNED NOT NULL,
    savedBy int unsigned NOT NULL,
    createAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (savedBy) REFERENCES users(id),
    FOREIGN KEY (artistId) REFERENCES users(id)
);

CREATE TABLE profile_view (
    id int unsigned NOT NULL AUTO_INCREMENT,
    artistId int UNSIGNED NOT NULL,
    viewedBy int unsigned NOT NULL,
    createAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (viewedBy) REFERENCES users(id),
    FOREIGN KEY (artistId) REFERENCES users(id)
);

