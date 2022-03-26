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
	const config = vscode.workspace.getConfiguration('jekyll-n-hyde');
	var siteSource = config.get<string>('site.source')!;
	if (siteSource.includes('${workspaceFolder}')) {
		if (vscode.workspace.workspaceFolders === undefined) {
			return;
		}
		const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
		siteSource = siteSource.replace('${workspaceFolder}', workspaceFolder);
	}

	refresh(context, siteSource);

	views.push(new CategoryView(context, 'categoryView'));
	views.push(new DraftView(context, 'draftView'));
	views.push(new PageView(context, 'pageView'));
	views.push(new PostView(context, 'postView'));

	updateActiveViews();

	vscode.commands.registerCommand('refresh', () => refresh(context, siteSource));
	vscode.commands.registerCommand('showTextDocument', showTextDocument);
	vscode.workspace.onDidSaveTextDocument(e => refresh(context, siteSource));
}

async function refresh(context: vscode.ExtensionContext, source: string) {
	CachedNodes.cache(context, new JekyllSite(source));
	views.forEach(v => v.refresh());
	updateActiveViews();
}

async function showTextDocument(resource: vscode.Uri) {
	vscode.window.showTextDocument(resource);
}

function updateActiveViews() {
	vscode.commands.executeCommand('setContext', 'activeViews', views.map(v => v.id));
}
