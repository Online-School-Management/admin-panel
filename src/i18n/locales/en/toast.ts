/**
 * Toast notification messages (English)
 */

export const toast = {
  success: 'Success',
  error: 'Error',
  created: 'Created',
  updated: 'Updated',
  deleted: 'Deleted',
  createFailed: 'Create Failed',
  updateFailed: 'Update Failed',
  deleteFailed: 'Delete Failed',
  somethingWentWrong: 'Something went wrong',
  createdSuccessfully: (item: string) => `The ${item} has been added successfully.`,
  updatedSuccessfully: (item: string) => `The ${item} has been updated successfully.`,
  deletedSuccessfully: (item: string) => `The ${item} has been deleted successfully.`,
  createFailedMessage: (item: string) => `Something went wrong while creating the ${item}.`,
  updateFailedMessage: (item: string) => `Something went wrong while updating the ${item}.`,
  deleteFailedMessage: (item: string) => `Something went wrong while deleting the ${item}.`,
}


