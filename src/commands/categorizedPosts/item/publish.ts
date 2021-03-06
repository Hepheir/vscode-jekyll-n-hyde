import * as vscode from "vscode";
import { Publisher } from '../../../models/publisher';
import { Entry } from "../../../views/categorizedPosts";


export const disposable = vscode.commands.registerCommand('categorizedPosts.item.publish', async (entry: Entry) => {
    if (!entry.post) return;
    return await Promise.resolve().then(async () => {
        const draft = entry.post!;
        const postUri = await Publisher.publish(draft);
        await vscode.window.showTextDocument(postUri);
    }).catch().then(async () => {
        await vscode.commands.executeCommand('categorizedPosts.refresh');
    });
});
