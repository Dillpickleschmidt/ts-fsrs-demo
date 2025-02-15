import { getAuthSession } from "@/app/(auth)/api/auth/[...nextauth]/session";
import MenuItem from ".";
import SyncSubmitButton from "../submit/SyncSubmit";
import { getFSRSParamsByUid } from "@/lib/fsrs";
import { getLingqLanguageCode, syncLingqs } from "@/vendor/lingq/sync";

async function syncLingqAction(formData: FormData) {
    'use server'
    const session = await getAuthSession();
    if (!session?.user) {
        throw new Error('No user');
    }
    const uid = session.user.id
    const params = await getFSRSParamsByUid(Number(uid))
    if (!params.lingq_token) {
        throw new Error('No lingq Token');
    }
    const syncUser = {
        token: params.lingq_token,
        uid: params.uid
    }
    const langs = await getLingqLanguageCode(syncUser)
    const syncs = langs.map(async (lang) => syncLingqs(syncUser, lang))
    await Promise.all(syncs)
    return true
};

async function SyncLingq() {

    return (
        <MenuItem tip="Sync Lingq" formAction={syncLingqAction}>
            <SyncSubmitButton />
        </MenuItem>
    );
}

export default SyncLingq;