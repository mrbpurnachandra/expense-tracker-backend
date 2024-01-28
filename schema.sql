USE expense_tracker; 

DROP TABLE IF EXISTS user; 
CREATE TABLE user (
    id INT AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
); 

DROP TABLE IF EXISTS urgency; 
CREATE TABLE urgency (
    id INT AUTO_INCREMENT, 
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
); 

DROP TABLE IF EXISTS expense; 
CREATE TABLE expense (
    id INT AUTO_INCREMENT,
    topic VARCHAR(255) NOT NULL,
    amount DOUBLE NOT NULL, 
    created_at DATETIME NOT NULL DEFAULT NOW(), 
    updated_at DATETIME, 
    user_id INT NOT NULL, 
    urgency_id INT NOT NULL, 
    PRIMARY KEY(id)
);

ALTER TABLE expense ADD CONSTRAINT 	expense_user_fk FOREIGN KEY(user_id) REFERENCES user(id);
ALTER TABLE expense ADD CONSTRAINT expense_urgency_fk FOREIGN KEY(urgency_id) REFERENCES urgency(id);

INSERT INTO urgency(name) VALUES("Low"), VALUES("Medium"), VALUES("High"); 
