import {Account, Avatars, Client, Databases, ID, Query} from 'appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    projectId: '66fecc5e00101aca76c9',
    databaseId: '66feccb20002ce74721a',
    userCollectionId: '66feccca001d10dcb174',
    savedProjectsCollectionId: '671a4ab70036414567c7'
}

const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client)

export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);

        return await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        );
    } catch (e) {
        console.error(e);
        throw new Error(e);
    }
}

export const signIn = async (email, password) => {
    try {
        return await account.createEmailPasswordSession(email, password);
    } catch (e) {
        throw new Error(e);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        return currentUser.documents[0];
    } catch (e) {
        console.error(e)
        throw new Error(e)
    }
}

export const signOut = async () => {
    try {
        return await account.deleteSession('current')
    } catch (e) {
        console.error(e)
        throw new Error(e)
    }
}

export const createSavedProject = async (name, content, path) => {
    try {
        const currentUser = await getCurrentUser();
        return await databases.createDocument(
            config.databaseId,
            config.savedProjectsCollectionId,
            ID.unique(),
            {
                name,
                content,
                userId: currentUser.$id,
                type: path === 'photos' ? 'photo' : 'photobook'
            }
        );
    } catch (e) {
        console.error(e);
        throw new Error(e);
    }
}

export const getSavedProjects = async () => {
    try {
        const currentUser = await getCurrentUser();
        return await databases.listDocuments(
            config.databaseId,
            config.savedProjectsCollectionId,
            [Query.equal('userId', currentUser.$id)]
        );
    } catch (e) {
        console.error(e)
        throw new Error(e)
    }
}

export const deleteSavedProject = async (projectId) => {
    try {
        return await databases.deleteDocument(
            config.databaseId,
            config.savedProjectsCollectionId,
            projectId
        );
    } catch (e) {
        console.error(e)
        throw new Error(e)
    }
}

export { ID};
