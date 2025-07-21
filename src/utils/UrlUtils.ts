class UrlUtils {
  fileExtensionFromUrl(url: string | undefined): string | undefined {
    let format: string | undefined;

    if (url) {
      try {
        const parsedUrl = new URL(url);
        const pathParts = parsedUrl.pathname.split('.');
        if (pathParts.length > 1) {
          format = pathParts[pathParts.length - 1];
        }
      } catch (_e) {
        // will return undefined
      }
    }

    return format;
  }

  domainFromUrl(url: string | undefined): string | undefined {
    let domain: string | undefined;

    if (url) {
      try {
        const parsedUrl = new URL(url);
        domain = parsedUrl.hostname;
      } catch (_e) {
        // will return undefined
      }
    }

    return domain;
  }
}

const instance = new UrlUtils();

export { instance as UrlUtils };
