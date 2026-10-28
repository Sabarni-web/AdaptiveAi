const { aiService } = require('./server/dist/services/aiService');

async function testFullFlow() {
  console.log('Testing detectAIGeneratedText on various inputs:');

  const testCases = [
    {
      name: 'ChatGPT comparative answer',
      text: 'AWS Lambda and Amazon EC2 represent two distinct computing paradigms. AWS Lambda is an event-driven serverless compute platform that manages server provisioning, automated scaling, and charging strictly per millisecond of compute time. Conversely, Amazon Elastic Compute Cloud (EC2) provides resizable virtual server instances in the cloud, giving users full administrative control over the operating system, network configuration, and runtime environment.'
    },
    {
      name: 'Textbook definition answer',
      text: 'AWS S3 is an object storage service offering industry-leading scalability, data availability, security, and performance. Customers of all sizes can store and protect any amount of data for virtually any use case.'
    },
    {
      name: 'Student typo human answer',
      text: 'lambda runs on events and you dont manage servers at all, ec2 gives you a virtual machine where you can install anything yourself.'
    }
  ];

  for (const tc of testCases) {
    console.log(`\n--- Test: ${tc.name} ---`);
    const res = await aiService.detectAIGeneratedText(tc.text);
    console.log('Result:', JSON.stringify(res, null, 2));
  }
}

testFullFlow().then(() => console.log('\nFinished all tests.')).catch(console.error);

