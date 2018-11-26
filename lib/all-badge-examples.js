'use strict'

const { loadServiceClasses } = require('../services')

const allBadgeExamples = [
  { id: 'build', name: 'Build' },
  { id: 'chat', name: 'Chat' },
  { id: 'dependencies', name: 'Dependencies' },
  { id: 'size', name: 'Size' },
  { id: 'downloads', name: 'Downloads' },
  { id: 'funding', name: 'Funding' },
  { id: 'issue-tracking', name: 'Issue Tracking' },
  { id: 'license', name: 'License' },
  { id: 'rating', name: 'Rating' },
  { id: 'social', name: 'Social' },
  { id: 'version', name: 'Version' },
  { id: 'platform-support', name: 'Platform & Version Support' },
  { id: 'monitoring', name: 'Monitoring' },
  { id: 'other', name: 'Other' },
]

function findCategory(wantedCategory) {
  return allBadgeExamples.find(
    thisCat => thisCat.category.id === wantedCategory
  )
}

function loadExamples() {
  loadServiceClasses().forEach(ServiceClass => {
    const prepared = ServiceClass.prepareExamples()
    if (prepared.length === 0) {
      return
    }
    const category = findCategory(ServiceClass.category)
    if (category === undefined) {
      throw Error(
        `Unknown category ${ServiceClass.category} referenced in ${
          ServiceClass.name
        }`
      )
    }
    category.examples = category.examples.concat(prepared)
  })
}
loadExamples()

module.exports = allBadgeExamples
module.exports.findCategory = findCategory
