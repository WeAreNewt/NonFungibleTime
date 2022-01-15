import { upgrades } from 'hardhat';

async function main() {
  await upgrades.admin.transferProxyAdminOwnership('0xFCBe19583A9E01dA39b477AC47585355A233EF3e');
  console.log('Done!');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
