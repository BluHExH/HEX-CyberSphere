/**
 * HEX-CyberSphere Puppeteer Automation Module
 * Specialized web automation using Puppeteer
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;

class PuppeteerAutomation {
  constructor() {
    this.browser = null;
    this.activePages = new Map();
  }
  
  // Initialize browser instance
  async init(options = {}) {
    try {
      this.browser = await puppeteer.launch({
        headless: options.headless !== false, // Default to headless
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ],
        ...options
      });
      
      console.log('Puppeteer browser initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize Puppeteer browser:', error);
      return false;
    }
  }
  
  // Navigate to URL
  async navigate(url, options = {}) {
    try {
      if (!this.browser) {
        throw new Error('Browser not initialized. Call init() first.');
      }
      
      const page = await this.browser.newPage();
      const pageId = Date.now().toString();
      
      // Set viewport
      await page.setViewport({
        width: options.width || 1920,
        height: options.height || 1080
      });
      
      // Set user agent
      await page.setUserAgent(options.userAgent || 
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      // Navigate to URL
      await page.goto(url, {
        waitUntil: options.waitUntil || 'networkidle2',
        timeout: options.timeout || 30000
      });
      
      // Store page reference
      this.activePages.set(pageId, { page, url, createdAt: new Date() });
      
      return {
        pageId,
        url,
        title: await page.title(),
        status: 'success'
      };
    } catch (error) {
      console.error('Navigation failed:', error);
      return { status: 'error', message: error.message };
    }
  }
  
  // Perform actions on a page
  async performActions(pageId, actions) {
    try {
      const pageEntry = this.activePages.get(pageId);
      if (!pageEntry) {
        throw new Error(`Page with ID ${pageId} not found`);
      }
      
      const { page } = pageEntry;
      const results = [];
      
      for (const action of actions) {
        try {
          let result;
          
          switch (action.type) {
            case 'click':
              await page.click(action.selector, action.options);
              result = `Clicked on ${action.selector}`;
              break;
              
            case 'type':
              await page.type(action.selector, action.text, action.options);
              result = `Typed "${action.text}" into ${action.selector}`;
              break;
              
            case 'waitForSelector':
              await page.waitForSelector(action.selector, action.options);
              result = `Waited for ${action.selector}`;
              break;
              
            case 'waitForTimeout':
              await page.waitForTimeout(action.timeout);
              result = `Waited for ${action.timeout}ms`;
              break;
              
            case 'screenshot':
              const screenshotOptions = {
                encoding: 'base64',
                ...action.options
              };
              const screenshot = await page.screenshot(screenshotOptions);
              result = { 
                type: 'screenshot', 
                data: screenshot,
                message: 'Screenshot taken'
              };
              break;
              
            case 'extractText':
              const text = await page.evaluate((selector) => {
                const element = document.querySelector(selector);
                return element ? element.textContent.trim() : null;
              }, action.selector);
              result = { 
                type: 'extracted_text', 
                selector: action.selector,
                text 
              };
              break;
              
            case 'extractAttribute':
              const attribute = await page.evaluate(({ selector, attr }) => {
                const element = document.querySelector(selector);
                return element ? element.getAttribute(attr) : null;
              }, { selector: action.selector, attr: action.attribute });
              result = { 
                type: 'extracted_attribute', 
                selector: action.selector,
                attribute: action.attribute,
                value: attribute
              };
              break;
              
            case 'evaluate':
              const evaluation = await page.evaluate(action.script);
              result = { 
                type: 'evaluation', 
                result: evaluation
              };
              break;
              
            default:
              result = `Unknown action type: ${action.type}`;
          }
          
          results.push({
            action: action.type,
            result,
            timestamp: new Date().toISOString()
          });
        } catch (actionError) {
          results.push({
            action: action.type,
            error: actionError.message,
            timestamp: new Date().toISOString()
          });
        }
      }
      
      return {
        pageId,
        actions: results,
        status: 'success'
      };
    } catch (error) {
      console.error('Action execution failed:', error);
      return { status: 'error', message: error.message };
    }
  }
  
  // Close a specific page
  async closePage(pageId) {
    try {
      const pageEntry = this.activePages.get(pageId);
      if (!pageEntry) {
        throw new Error(`Page with ID ${pageId} not found`);
      }
      
      const { page } = pageEntry;
      await page.close();
      this.activePages.delete(pageId);
      
      return { status: 'success', message: `Page ${pageId} closed` };
    } catch (error) {
      console.error('Failed to close page:', error);
      return { status: 'error', message: error.message };
    }
  }
  
  // Get all active pages
  getActivePages() {
    return Array.from(this.activePages.entries()).map(([id, info]) => ({
      id,
      url: info.url,
      createdAt: info.createdAt
    }));
  }
  
  // Close all pages and browser
  async close() {
    try {
      // Close all pages
      for (const [pageId] of this.activePages) {
        await this.closePage(pageId);
      }
      
      // Close browser
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }
      
      console.log('Puppeteer automation closed');
      return { status: 'success', message: 'All resources closed' };
    } catch (error) {
      console.error('Failed to close Puppeteer automation:', error);
      return { status: 'error', message: error.message };
    }
  }
  
  // Save page content to file
  async savePageContent(pageId, filePath) {
    try {
      const pageEntry = this.activePages.get(pageId);
      if (!pageEntry) {
        throw new Error(`Page with ID ${pageId} not found`);
      }
      
      const { page } = pageEntry;
      const content = await page.content();
      
      await fs.writeFile(filePath, content, 'utf8');
      
      return { 
        status: 'success', 
        message: `Page content saved to ${filePath}`,
        path: filePath
      };
    } catch (error) {
      console.error('Failed to save page content:', error);
      return { status: 'error', message: error.message };
    }
  }
  
  // Take full page screenshot
  async takeFullScreenshot(pageId, filePath) {
    try {
      const pageEntry = this.activePages.get(pageId);
      if (!pageEntry) {
        throw new Error(`Page with ID ${pageId} not found`);
      }
      
      const { page } = pageEntry;
      await page.screenshot({ 
        path: filePath, 
        fullPage: true 
      });
      
      return { 
        status: 'success', 
        message: `Full page screenshot saved to ${filePath}`,
        path: filePath
      };
    } catch (error) {
      console.error('Failed to take full page screenshot:', error);
      return { status: 'error', message: error.message };
    }
  }
}

// Export the class
module.exports = PuppeteerAutomation;

// Example usage
if (require.main === module) {
  (async () => {
    const automation = new PuppeteerAutomation();
    
    try {
      // Initialize browser
      await automation.init();
      
      // Navigate to a website
      const navResult = await automation.navigate('https://example.com');
      console.log('Navigation result:', navResult);
      
      if (navResult.status === 'success') {
        // Perform actions
        const actions = [
          { type: 'extractText', selector: 'h1' },
          { type: 'screenshot' }
        ];
        
        const actionResult = await automation.performActions(navResult.pageId, actions);
        console.log('Action result:', actionResult);
        
        // Save page content
        const saveResult = await automation.savePageContent(navResult.pageId, 'example_page.html');
        console.log('Save result:', saveResult);
        
        // Close page
        await automation.closePage(navResult.pageId);
      }
      
      // Close browser
      await automation.close();
    } catch (error) {
      console.error('Example execution failed:', error);
    }
  })();
}