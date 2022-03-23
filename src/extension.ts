import * as vscode from 'vscode';
import { JekyllSite } from './jekyllSite';
import { CachedNodes } from './views/nodes/cachedNodes';
import { CategoryView } from './views/categoryView';
import { DraftView } from './views/draftView';
import { PageView } from './views/pageView';
import { PostView } from './views/postView';
import { ViewBase } from './views/viewBase';


const views: ViewBase[] = [];


export function activate(context: vscode.ExtensionContext) {
	const source = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
		? vscode.workspace.workspaceFolders[0].uri.fsPath
		: undefined;

	if (!source) {
		return;
	}

	refresh(context, source);

	views.push(new CategoryView(context, 'categoryView'));
	views.push(new DraftView(context, 'draftView'));
	views.push(new PageView(context, 'pageView'));
	views.push(new PostView(context, 'postView'));

	vscode.commands.registerCommand('refresh', () => refresh(context, source));
	vscode.commands.registerCommand('showTextDocument', showTextDocument);
}

async function refresh(context: vscode.ExtensionContext, source: string) {
	CachedNodes.cache(context, new JekyllSite(source));
	views.forEach(v => v.refresh());
}

async function showTextDocument(resource: vscode.Uri) {
	vscode.window.showTextDocument(resource);
}
