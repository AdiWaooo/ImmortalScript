-- ImmortalScript Database Schema for SQL Server
-- Create database
CREATE DATABASE ImmortalScript;
GO

USE ImmortalScript;
GO

-- Users Table
CREATE TABLE [Users] (
    [UserID] INT PRIMARY KEY IDENTITY(1,1),
    [Username] NVARCHAR(100) NOT NULL UNIQUE,
    [Email] NVARCHAR(150) NOT NULL UNIQUE,
    [PasswordHash] NVARCHAR(MAX) NOT NULL,
    [FirstName] NVARCHAR(100),
    [LastName] NVARCHAR(100),
    [ProfilePicture] NVARCHAR(MAX),
    [Bio] NVARCHAR(500),
    [CreatedAt] DATETIME DEFAULT GETDATE(),
    [UpdatedAt] DATETIME DEFAULT GETDATE(),
    [IsActive] BIT DEFAULT 1,
    [LastLogin] DATETIME
);
GO

-- Scripts Table
CREATE TABLE [Scripts] (
    [ScriptID] INT PRIMARY KEY IDENTITY(1,1),
    [Title] NVARCHAR(200) NOT NULL,
    [Description] NVARCHAR(MAX),
    [Content] NVARCHAR(MAX) NOT NULL,
    [Language] NVARCHAR(50),
    [AuthorID] INT NOT NULL,
    [Version] NVARCHAR(20) DEFAULT '1.0.0',
    [Category] NVARCHAR(100),
    [IsPublic] BIT DEFAULT 1,
    [Downloads] INT DEFAULT 0,
    [CreatedAt] DATETIME DEFAULT GETDATE(),
    [UpdatedAt] DATETIME DEFAULT GETDATE(),
    [DeletedAt] DATETIME,
    FOREIGN KEY ([AuthorID]) REFERENCES [Users]([UserID]) ON DELETE CASCADE
);
GO

-- Script Tags Table
CREATE TABLE [Tags] (
    [TagID] INT PRIMARY KEY IDENTITY(1,1),
    [TagName] NVARCHAR(100) NOT NULL UNIQUE,
    [CreatedAt] DATETIME DEFAULT GETDATE()
);
GO

-- Script Tags Mapping
CREATE TABLE [ScriptTags] (
    [ScriptTagID] INT PRIMARY KEY IDENTITY(1,1),
    [ScriptID] INT NOT NULL,
    [TagID] INT NOT NULL,
    FOREIGN KEY ([ScriptID]) REFERENCES [Scripts]([ScriptID]) ON DELETE CASCADE,
    FOREIGN KEY ([TagID]) REFERENCES [Tags]([TagID]) ON DELETE CASCADE,
    UNIQUE ([ScriptID], [TagID])
);
GO

-- Script Versions Table (for version history)
CREATE TABLE [ScriptVersions] (
    [VersionID] INT PRIMARY KEY IDENTITY(1,1),
    [ScriptID] INT NOT NULL,
    [VersionNumber] NVARCHAR(20),
    [Content] NVARCHAR(MAX) NOT NULL,
    [ChangeLog] NVARCHAR(MAX),
    [CreatedAt] DATETIME DEFAULT GETDATE(),
    [CreatedBy] INT NOT NULL,
    FOREIGN KEY ([ScriptID]) REFERENCES [Scripts]([ScriptID]) ON DELETE CASCADE,
    FOREIGN KEY ([CreatedBy]) REFERENCES [Users]([UserID])
);
GO

-- Comments Table
CREATE TABLE [Comments] (
    [CommentID] INT PRIMARY KEY IDENTITY(1,1),
    [ScriptID] INT NOT NULL,
    [UserID] INT NOT NULL,
    [CommentText] NVARCHAR(MAX) NOT NULL,
    [CreatedAt] DATETIME DEFAULT GETDATE(),
    [UpdatedAt] DATETIME DEFAULT GETDATE(),
    [IsEdited] BIT DEFAULT 0,
    FOREIGN KEY ([ScriptID]) REFERENCES [Scripts]([ScriptID]) ON DELETE CASCADE,
    FOREIGN KEY ([UserID]) REFERENCES [Users]([UserID]) ON DELETE CASCADE
);
GO

-- Ratings Table
CREATE TABLE [Ratings] (
    [RatingID] INT PRIMARY KEY IDENTITY(1,1),
    [ScriptID] INT NOT NULL,
    [UserID] INT NOT NULL,
    [Rating] INT NOT NULL CHECK ([Rating] >= 1 AND [Rating] <= 5),
    [ReviewText] NVARCHAR(MAX),
    [CreatedAt] DATETIME DEFAULT GETDATE(),
    [UpdatedAt] DATETIME DEFAULT GETDATE(),
    UNIQUE ([ScriptID], [UserID]),
    FOREIGN KEY ([ScriptID]) REFERENCES [Scripts]([ScriptID]) ON DELETE CASCADE,
    FOREIGN KEY ([UserID]) REFERENCES [Users]([UserID]) ON DELETE CASCADE
);
GO

-- Favorites Table
CREATE TABLE [Favorites] (
    [FavoriteID] INT PRIMARY KEY IDENTITY(1,1),
    [UserID] INT NOT NULL,
    [ScriptID] INT NOT NULL,
    [CreatedAt] DATETIME DEFAULT GETDATE(),
    UNIQUE ([UserID], [ScriptID]),
    FOREIGN KEY ([UserID]) REFERENCES [Users]([UserID]) ON DELETE CASCADE,
    FOREIGN KEY ([ScriptID]) REFERENCES [Scripts]([ScriptID]) ON DELETE CASCADE
);
GO

-- Download History Table
CREATE TABLE [DownloadHistory] (
    [DownloadID] INT PRIMARY KEY IDENTITY(1,1),
    [ScriptID] INT NOT NULL,
    [UserID] INT,
    [DownloadedAt] DATETIME DEFAULT GETDATE(),
    [IPAddress] NVARCHAR(50),
    FOREIGN KEY ([ScriptID]) REFERENCES [Scripts]([ScriptID]) ON DELETE CASCADE,
    FOREIGN KEY ([UserID]) REFERENCES [Users]([UserID]) ON DELETE SET NULL
);
GO

-- Create Indexes for better performance
CREATE INDEX [IX_Scripts_AuthorID] ON [Scripts]([AuthorID]);
GO

CREATE INDEX [IX_Scripts_Category] ON [Scripts]([Category]);
GO

CREATE INDEX [IX_Scripts_IsPublic] ON [Scripts]([IsPublic]);
GO

CREATE INDEX [IX_Comments_ScriptID] ON [Comments]([ScriptID]);
GO

CREATE INDEX [IX_Comments_UserID] ON [Comments]([UserID]);
GO

CREATE INDEX [IX_Ratings_ScriptID] ON [Ratings]([ScriptID]);
GO

CREATE INDEX [IX_Ratings_UserID] ON [Ratings]([UserID]);
GO

CREATE INDEX [IX_Favorites_UserID] ON [Favorites]([UserID]);
GO

CREATE INDEX [IX_Favorites_ScriptID] ON [Favorites]([ScriptID]);
GO

CREATE INDEX [IX_DownloadHistory_ScriptID] ON [DownloadHistory]([ScriptID]);
GO

CREATE INDEX [IX_DownloadHistory_UserID] ON [DownloadHistory]([UserID]);
GO

CREATE INDEX [IX_ScriptVersions_ScriptID] ON [ScriptVersions]([ScriptID]);
GO
