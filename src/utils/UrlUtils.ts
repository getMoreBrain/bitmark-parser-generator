class UrlUtils {
  fileExtensionFromUrl(url: string | undefined): string | undefined {
    let format: string | undefined;

    if (url) {
      const parsedUrl = new URL(url);
      const pathParts = parsedUrl.pathname.split('.');
      if (pathParts.length > 1) {
        format = pathParts[pathParts.length - 1];
      }
    }

    return format;
  }

  domainFromUrl(url: string | undefined): string | undefined {
    let domain: string | undefined;

    if (url) {
      const parsedUrl = new URL(url);
      domain = parsedUrl.hostname;
    }

    return domain;
  }
}

const instance = new UrlUtils();

export { instance as UrlUtils };
