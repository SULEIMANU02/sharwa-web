'use client';

import { useState, useEffect } from 'react';
import { 
  Code,
  Copy,
  Check,
  Terminal,
  FileJson,
  Shield,
  Key,
  Globe,
  Server,
  AlertCircle,
  Zap,
  Database,
  RefreshCw,
  Play,
  ChevronRight,
  Filter,
  Smartphone,
  Wifi
} from 'lucide-react';

export default function ApiDocsPage() {
  const [copiedSections, setCopiedSections] = useState({});
  const [apiKey, setApiKey] = useState('');
  const [apiPlans, setApiPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [testResponse, setTestResponse] = useState(null);
  const [testing, setTesting] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('all');

  useEffect(() => {
    loadApiKey();
    fetchDataPlans();
  }, []);

  useEffect(() => {
    if (selectedNetwork === 'all') {
      setFilteredPlans(apiPlans);
    } else {
      setFilteredPlans(apiPlans.filter(plan => plan.network === selectedNetwork));
    }
  }, [selectedNetwork, apiPlans]);

  const loadApiKey = () => {
    const key = localStorage.getItem('apiKey') || '';
    setApiKey(key);
  };

  const fetchDataPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://sharwadata.com.ng/api/plans/data');
      const result = await response.json();
      
      if (result.success) {
        const formattedPlans = result.data.map(plan => ({
          id: plan.id,
          plan_id: plan.planid,
          name: plan.name,
          price: parseFloat(plan.api) || 0,
          network: plan.network,
          type: plan.type
        })).filter(plan => plan.price > 0);
        
        setApiPlans(formattedPlans);
        setFilteredPlans(formattedPlans);
      } else {
        setError('Failed to load data plans');
      }
    } catch (error) {
      console.error('Error fetching data plans:', error);
      setError('Failed to load data plans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, section) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSections(prev => ({ ...prev, [section]: true }));
      setTimeout(() => {
        setCopiedSections(prev => ({ ...prev, [section]: false }));
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const testApiEndpoint = async () => {
    if (!apiKey) {
      alert('Please set your API key first');
      return;
    }

    setTesting(true);
    setTestResponse(null);

    try {
      const testData = {
        network: 1,
        mobile_number: "09037346247",
        plan: 3,
        Ported_number: true
      };

      const response = await fetch('https://api.sharwadata.com/data/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      });

      const result = await response.json();
      setTestResponse({
        status: response.status,
        data: result
      });
    } catch (error) {
      setTestResponse({
        status: 0,
        data: { error: error.message }
      });
    } finally {
      setTesting(false);
    }
  };

  const formatApiKey = (key) => {
    if (!key) return 'No API key found';
    return `${key.substring(0, 8)}...${key.substring(key.length - 8)}`;
  };

  const getNetworkColor = (network) => {
    switch (network) {
      case 'mtn': return 'bg-yellow-500';
      case 'glo': return 'bg-green-500';
      case 'airtel': return 'bg-red-500';
      case '9mobile': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getNetworkName = (network) => {
    switch (network) {
      case 'mtn': return 'MTN';
      case 'glo': return 'GLO';
      case 'airtel': return 'AIRTEL';
      case '9mobile': return '9MOBILE';
      default: return network.toUpperCase();
    }
  };

  const codeExamples = {
    curl: `curl --location 'https://api.sharwadata.com/data/' \\
--header 'Authorization: Token ${apiKey || 'YOUR_API_KEY'}' \\
--header 'Content-Type: application/json' \\
--data '{
  "network": 1,
  "mobile_number": "09037346247",
  "plan": 3,
  "Ported_number": true
}'`,

    javascript: `fetch('https://api.sharwadata.com/data/', {
  method: 'POST',
  headers: {
    'Authorization': 'Token ${apiKey || 'YOUR_API_KEY'}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    network: 1,
    mobile_number: "09037346247",
    plan: 3,
    Ported_number: true
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`,

    python: `import requests

url = "https://api.sharwadata.com/data/"
headers = {
    "Authorization": "Token ${apiKey || 'YOUR_API_KEY'}",
    "Content-Type": "application/json"
}
data = {
    "network": 1,
    "mobile_number": "09037346247",
    "plan": 3,
    "Ported_number": True
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Code className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">API Documentation</h1>
                <p className="text-sm text-gray-500">Developer resources for data purchase</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="text-sm hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {['overview', 'authentication', 'endpoints', 'examples', 'plans'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                      activeTab === tab
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'overview'
                      ? 'bg-blue-50 text-blue-700 border border-blue-100'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Globe className="h-4 w-4" />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => setActiveTab('authentication')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'authentication'
                      ? 'bg-blue-50 text-blue-700 border border-blue-100'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  <span>Authentication</span>
                </button>
                <button
                  onClick={() => setActiveTab('endpoints')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'endpoints'
                      ? 'bg-blue-50 text-blue-700 border border-blue-100'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Server className="h-4 w-4" />
                  <span>Endpoints</span>
                </button>
                <button
                  onClick={() => setActiveTab('examples')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'examples'
                      ? 'bg-blue-50 text-blue-700 border border-blue-100'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Terminal className="h-4 w-4" />
                  <span>Code Examples</span>
                </button>
                <button
                  onClick={() => setActiveTab('plans')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'plans'
                      ? 'bg-blue-50 text-blue-700 border border-blue-100'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Database className="h-4 w-4" />
                  <span>Data Plans</span>
                </button>
              </nav>

              {/* API Key Section */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Key className="h-4 w-4 text-gray-500" />
                  <h3 className="text-sm font-medium text-gray-700">Your API Key</h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="font-mono text-sm text-gray-800 break-all">
                    {apiKey ? formatApiKey(apiKey) : 'No API key found'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Use this key in the Authorization header
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(apiKey, 'apiKey')}
                  disabled={!apiKey}
                  className="w-full mt-3 flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {copiedSections.apiKey ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy API Key
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Purchase API</h2>
                      <p className="text-gray-600">Purchase mobile data bundles programmatically</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center gap-3 mb-2">
                        <Server className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-800">Base URL</h3>
                      </div>
                      <code className="font-mono text-xs sm:text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded break-all">
                        https://api.sharwadata.com
                      </code>
                    </div>

                    <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold text-gray-800">Authentication</h3>
                      </div>
                      <p className="text-sm text-gray-600">Token-based authentication</p>
                    </div>

                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                      <div className="flex items-center gap-3 mb-2">
                        <FileJson className="h-5 w-5 text-purple-600" />
                        <h3 className="font-semibold text-gray-800">Response Format</h3>
                      </div>
                      <p className="text-sm text-gray-600">JSON</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Features</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Smartphone className="h-5 w-5 text-blue-600 mt-0.5" />
                        <span className="text-gray-700">Purchase data for all Nigerian networks</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Wifi className="h-5 w-5 text-green-600 mt-0.5" />
                        <span className="text-gray-700">Real-time transaction processing</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Filter className="h-5 w-5 text-purple-600 mt-0.5" />
                        <span className="text-gray-700">Support for ported numbers</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Code className="h-5 w-5 text-red-600 mt-0.5" />
                        <span className="text-gray-700">Detailed response with transaction status</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Authentication Tab */}
            {activeTab === 'authentication' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Authentication</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Token Authentication</h3>
                    <p className="text-gray-600 mb-4">
                      All API requests require authentication using a Bearer token. Your API key should be included in the Authorization header of every request.
                    </p>
                    
                    <div className="bg-gray-900 rounded-xl p-4 sm:p-6">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <Terminal className="h-4 w-4 text-green-400" />
                          <span className="text-green-400 text-sm">Authorization Header</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(`Authorization: Token ${apiKey || 'YOUR_API_KEY'}`, 'authHeader')}
                          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"
                        >
                          {copiedSections.authHeader ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                          Copy
                        </button>
                      </div>
                      <pre className="text-gray-300 text-xs sm:text-sm overflow-x-auto">
                        Authorization: Token {apiKey || 'YOUR_API_KEY'}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-800 mb-2">Security Best Practices</h4>
                        <ul className="text-sm text-yellow-700 space-y-2">
                          <li>Never expose your API key in client-side code or public repositories</li>
                          <li>Store API keys in environment variables</li>
                          <li>Use HTTPS for all API requests</li>
                          <li>Rotate your API keys regularly</li>
                          <li>Monitor your API usage for unusual activity</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Endpoints Tab */}
            {activeTab === 'endpoints' && (
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">API Endpoints</h2>
                
                <div className="space-y-6">
                  {/* Purchase Data Endpoint */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="bg-blue-800 px-2 sm:px-3 py-1 rounded-lg">
                            <span className="text-xs sm:text-sm font-bold text-white">POST</span>
                          </div>
                          <code className="text-white font-mono text-sm sm:text-base">/data/</code>
                        </div>
                        <span className="text-blue-200 text-sm">Purchase Data</span>
                      </div>
                    </div>
                    
                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Request Parameters</h3>
                      <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <div className="min-w-full inline-block align-middle">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameter</th>
                                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-3 sm:px-4 py-2 sm:py-3 font-mono text-xs sm:text-sm text-gray-900">network</td>
                                <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">Integer</td>
                                <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">Yes</td>
                                <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">Network ID (1=MTN, 2=GLO, 3=9MOBILE, 4=AIRTEL)</td>
                              </tr>
                              <tr>
                                <td className="px-3 sm:px-4 py-2 sm:py-3 font-mono text-xs sm:text-sm text-gray-900">mobile_number</td>
                                <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">String</td>
                                <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">Yes</td>
                                <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">11-digit Nigerian phone number</td>
                              </tr>
                              <tr>
                                <td className="px-3 sm:px-4 py-2 sm:py-3 font-mono text-xs sm:text-sm text-gray-900">plan</td>
                                <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">Integer</td>
                                <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">Yes</td>
                                <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">Plan ID from available plans</td>
                              </tr>
                              <tr>
                                <td className="px-3 sm:px-4 py-2 sm:py-3 font-mono text-xs sm:text-sm text-gray-900">Ported_number</td>
                                <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">Boolean</td>
                                <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">No</td>
                                <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">Set to true if number is ported</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Example Request</h3>
                        <div className="bg-gray-900 rounded-xl p-4 sm:p-6">
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                              <Terminal className="h-4 w-4 text-green-400" />
                              <span className="text-green-400 text-sm">cURL</span>
                            </div>
                            <button
                              onClick={() => copyToClipboard(codeExamples.curl, 'curlExample')}
                              className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"
                            >
                              {copiedSections.curlExample ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                              Copy
                            </button>
                          </div>
                          <pre className="text-gray-300 text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap">
                            {codeExamples.curl}
                          </pre>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Test Endpoint</h3>
                        <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <button
                              onClick={testApiEndpoint}
                              disabled={testing || !apiKey}
                              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {testing ? (
                                <>
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                  Testing...
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4" />
                                  Test API Call
                                </>
                              )}
                            </button>
                            <p className="text-sm text-gray-600">
                              Test the data purchase endpoint with sample data
                            </p>
                          </div>

                          {testResponse && (
                            <div className="mt-6">
                              <h4 className="font-semibold text-gray-800 mb-2">Response</h4>
                              <div className={`rounded-xl p-4 sm:p-6 ${testResponse.status === 200 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-2">
                                    <FileJson className="h-4 w-4" />
                                    <span className="font-mono text-xs sm:text-sm">
                                      Status: {testResponse.status}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => copyToClipboard(JSON.stringify(testResponse.data, null, 2), 'testResponse')}
                                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm"
                                  >
                                    {copiedSections.testResponse ? (
                                      <Check className="h-4 w-4" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                    Copy
                                  </button>
                                </div>
                                <pre className="text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap">
                                  {JSON.stringify(testResponse.data, null, 2)}
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Code Examples Tab */}
            {activeTab === 'examples' && (
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Code Examples</h2>
                
                <div className="space-y-6">
                  {/* JavaScript Example */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm sm:text-lg font-bold text-yellow-800">JS</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">JavaScript (Fetch API)</h3>
                      </div>
                      <button
                        onClick={() => copyToClipboard(codeExamples.javascript, 'jsExample')}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800"
                      >
                        {copiedSections.jsExample ? (
                          <>
                            <Check className="h-4 w-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy Code
                          </>
                        )}
                      </button>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-4 sm:p-6">
                      <pre className="text-gray-300 text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap">
                        {codeExamples.javascript}
                      </pre>
                    </div>
                  </div>

                  {/* Python Example */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm sm:text-lg font-bold text-blue-800">PY</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">Python (Requests)</h3>
                      </div>
                      <button
                        onClick={() => copyToClipboard(codeExamples.python, 'pythonExample')}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800"
                      >
                        {copiedSections.pythonExample ? (
                          <>
                            <Check className="h-4 w-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy Code
                          </>
                        )}
                      </button>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-4 sm:p-6">
                      <pre className="text-gray-300 text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap">
                        {codeExamples.python}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Data Plans Tab */}
            {activeTab === 'plans' && (
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Available Data Plans</h2>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={fetchDataPlans}
                      disabled={loading}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                    >
                      <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                      <span className="text-sm">Refresh</span>
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                  </div>
                )}

                {loading ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading data plans...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Network Filters */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <h3 className="text-sm font-medium text-gray-700">Filter by Network</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setSelectedNetwork('all')}
                          className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedNetwork === 'all'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                          }`}
                        >
                          All Networks
                        </button>
                        {['mtn', 'glo', 'airtel', '9mobile'].map((network) => (
                          <button
                            key={network}
                            onClick={() => setSelectedNetwork(network)}
                            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                              selectedNetwork === network
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${getNetworkColor(network)}`}></div>
                            {getNetworkName(network)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Plans Count */}
                    <div className="flex items-center justify-between">
                      <p className="text-gray-600 text-sm">
                        Showing {filteredPlans.length} of {apiPlans.length} plans
                      </p>
                      {selectedNetwork !== 'all' && (
                        <button
                          onClick={() => setSelectedNetwork('all')}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Clear filter
                        </button>
                      )}
                    </div>

                    {/* Plans Table */}
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Plan ID
                            </th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Network
                            </th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Plan Name
                            </th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Price (₦)
                            </th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredPlans.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="px-6 py-12 text-center">
                                <div className="text-gray-400">
                                  <Database className="h-12 w-12 mx-auto mb-3" />
                                  <p className="text-lg font-medium">No plans found</p>
                                  <p className="text-sm mt-1">Try changing your filter settings</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            filteredPlans.map((plan) => (
                              <tr key={plan.id} className="hover:bg-gray-50">
                                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                  <code className="text-black font-mono text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded">
                                    {plan.id}
                                  </code>
                                </td>
                                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${getNetworkColor(plan.network)}`}></div>
                                    <span className="font-medium text-gray-900 capitalize text-sm sm:text-base">
                                      {getNetworkName(plan.network)}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-3 sm:px-6 py-4">
                                  <div>
                                    <p className="text-gray-900 text-sm sm:text-base">{plan.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{plan.type}</p>
                                  </div>
                                </td>
                                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                  <span className="font-bold text-base sm:text-lg text-blue-600">
                                    ₦{plan.price.toFixed(2)}
                                  </span>
                                </td>
                                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                  <button
                                    onClick={() => copyToClipboard(plan.plan_id, `plan-${plan.id}`)}
                                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                                  >
                                    {copiedSections[`plan-${plan.id}`] ? (
                                      <>
                                        <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                                        <span className="hidden sm:inline">Copied</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                                        <span className="hidden sm:inline">Copy ID</span>
                                      </>
                                    )}
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Network Reference */}
                    <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Network IDs Reference</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        {[
                          { id: 1, name: 'MTN', network: 'mtn' },
                          { id: 2, name: 'GLO', network: 'glo' },
                          { id: 3, name: 'AIRTEL', network: 'airtel' },
                          { id: 4, name: '9MOBILE', network: '9mobile' }
                        ].map((network) => (
                          <div key={network.id} className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-3 h-3 rounded-full ${getNetworkColor(network.network)}`}></div>
                              <span className="font-medium text-sm sm:text-base">{network.name}</span>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600">API ID: {network.id}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}