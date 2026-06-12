create database if not exists myDiary;
use myDiary;
create table Users(
ID int primary key auto_increment,
EmailID varchar(50) unique,
HashedPassword varchar(100)
);
create table Posts(
ID int primary key auto_increment,
UserID int,
postTitle varchar(100),
postDescription varchar(1500),
foreign key(UserID) references Users(ID)
);