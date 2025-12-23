export function formatTimestampForFileAndLog(): string {
	const now = new Date();
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}-${String(now.getMilliseconds()).padStart(3, '0')}`;
}

export function makeDeploymentName(testTitle: string, projectName: string, timestamp?: string): string {
	const ts = timestamp ?? formatTimestampForFileAndLog();
	const safeTitle = testTitle.replace(/[^\w\d-]/g, '_');
	const safeProject = projectName.replace(/[^\w\d-]/g, '_');
	return `${safeTitle}-${safeProject}-${ts}`;
}

