const { writeFileSync } = require('fs')
const path = require('path')

const checks = require('../data/checks.json')

const addImplementationDetails = (check) => {
  if (!check.implementation_type) {
    return ''
  }
  let content = `- Implementation Details: It is ${check.implementation_type}`
  if (check.implementation_details_reference) {
    content += ` ([details](${check.implementation_details_reference})).`
  }
  return content
}

const addContent = (title, description, url) => {
  if (!description && !url) {
    return ''
  }

  if (url) {
    return `- ${title}: [${description}](${url})`
  }

  return `- ${title}: ${description}`
}

const renderDetails = (check) => {
  const implementationDetails = addImplementationDetails(check)
  const mitreDetails = addContent('Mitre', check.mitre_description, check.mitre_url)
  const sourcesDetails = addContent('Sources', check.sources_description, check.sources_url)
  const howToDetails = addContent('How To', check.how_to_description, check.how_to_url)
  let content = '## Details\n'
  content += `- Implementation Status: ${check.implementation_status}\n`
  if (implementationDetails) {
    content += `${implementationDetails}\n`
  }
  content += `- C-SCRM: ${check.is_c_scrm}\n`
  content += `- Priority Group: ${check.priority_group}\n`
  if (mitreDetails) {
    content += `${mitreDetails}\n`
  }
  if (sourcesDetails) {
    content += `${sourcesDetails}\n`
  }
  if (howToDetails) {
    content += `${howToDetails}\n`
  }
  content += `- Created at ${check.created_at}\n`
  content += `- Updated at ${check.updated_at}`
  return content
}

// Prepare the markdown files
checks.forEach((check, index) => {
  const metadata = `---
sidebar_position: ${index + 1}
id: ${check.id}
title: ${check.title}
slug: /details/${check.code_name}
---`.trim()
  const levelsContent = `
- Incubating: ${check.level_incubating_status}
- Active: ${check.level_active_status}
- Retiring: ${check.level_retiring_status}
`.trim()
  const descriptionContent = `## Description
${check.description}`.trim()
  const detailsContent = renderDetails(check)

  const fileContent = `${metadata}

## Use Case
<!-- LEVELS:START -->
${levelsContent}
<!-- LEVELS:END -->

<!-- DESCRIPTION:START -->
${descriptionContent}
<!-- DESCRIPTION:END -->

<!-- DETAILS:START -->
${detailsContent}
<!-- DETAILS:END -->
`
  const detination = path.join(process.cwd(), `docs/details/${check.code_name}.mdx`)
  writeFileSync(detination, fileContent)
})
